'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Key, Shield, ArrowRight, Loader2, CheckCircle, Copy, Eye, EyeOff } from 'lucide-react';
import jwt from 'jsonwebtoken';

export default function DevAdminLogin() {
  const router = useRouter();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [email, setEmail] = useState('aniruddhap66@gmail.com');
  const [password, setPassword] = useState('Tamdev54@#');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [displayedOTP, setDisplayedOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copiedOTP, setCopiedOTP] = useState(false);

  // Handle credential submission
  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp-dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      // Display the OTP for development
      if (data.developmentOTP) {
        setDisplayedOTP(data.developmentOTP);
        // Auto-fill OTP inputs
        const otpArray = data.developmentOTP.split('');
        setOtp(otpArray);
      }

      setSuccessMessage('OTP generated successfully!');
      setStep('otp');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  // Copy OTP to clipboard
  const copyOTP = () => {
    navigator.clipboard.writeText(displayedOTP);
    setCopiedOTP(true);
    setTimeout(() => setCopiedOTP(false), 2000);
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First verify OTP
      const verifyResponse = await fetch('/api/auth/send-otp-dev', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.error || 'OTP verification failed');
      }

      // Then do actual login
      const loginResponse = await fetch('/api/auth/direct-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.error || 'Login failed');
      }

      setSuccessMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push(loginData.redirect || '/admin/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-300">
              {step === 'credentials' ? 'Development Login' : 'Enter OTP Code'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 'credentials' ? (
              <motion.form
                key="credentials"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleCredentialSubmit}
                className="space-y-6"
              >
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Get OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOtpSubmit}
                className="space-y-6"
              >
                {/* Development OTP Display */}
                {displayedOTP && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-4">
                    <p className="text-green-300 text-sm mb-2">Development OTP Code:</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400 tracking-wider">
                        {displayedOTP}
                      </span>
                      <button
                        type="button"
                        onClick={copyOTP}
                        className="px-3 py-1 bg-green-500/30 hover:bg-green-500/40 rounded text-green-300 text-sm flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" />
                        {copiedOTP ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 text-center">
                    Enter OTP Code
                  </label>
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>
                </div>

                {/* Verify Button */}
                <button
                  type="submit"
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      Verify & Login
                    </>
                  )}
                </button>

                {/* Back Button */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('credentials');
                      setOtp(['', '', '', '', '', '']);
                      setError('');
                      setSuccessMessage('');
                      setDisplayedOTP('');
                    }}
                    className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
                  >
                    ← Back to login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Links */}
        <div className="text-center mt-6 space-y-2">
          <a href="/admin/simple-login" className="block text-gray-400 hover:text-gray-300 text-sm">
            Use Simple Login (No OTP)
          </a>
          <p className="text-gray-500 text-xs">
            OTP is displayed for development purposes only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
