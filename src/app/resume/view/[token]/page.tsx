'use client';

import { useState, useEffect, useCallback, use, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Lock, 
  Eye, 
  AlertTriangle, 
  Loader2, 
  FileText,
  ShieldCheck,
  Download,
  Printer
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SecureViewerPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileData, setFileData] = useState<string | null>(null);
  const [contentType, setContentType] = useState('application/pdf');
  const [viewerEmail, setViewerEmail] = useState('');
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  
  const [isFocused, setIsFocused] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [securityLock, setSecurityLock] = useState(false);

  const blobUrlRef = useRef<string | null>(null);
  const pulseTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastFrameTime = useRef<number>(0);
  const securityLockTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchResume = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/resume/view/${token}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load resume');
      }

      setFileData(result.data.fileData);
      setContentType(result.data.contentType);
      setViewerEmail(result.data.viewerEmail);

      const byteCharacters = atob(result.data.fileData);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: result.data.contentType });
      const url = URL.createObjectURL(blob);
      setBlobUrl(url);
      blobUrlRef.current = url;

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Frame-Freeze & Integrity Monitoring
  useEffect(() => {
    let frameId: number;
    const monitorFrame = (time: number) => {
      if (lastFrameTime.current > 0) {
        const delta = time - lastFrameTime.current;
        // If the browser frames freeze for >100ms (typical during capture tools)
        if (delta > 100 && !securityLock) {
           handleSecurityViolation("Frame Integrity Compromised/Freeze Detected");
        }
      }
      lastFrameTime.current = time;
      frameId = requestAnimationFrame(monitorFrame);
    };
    frameId = requestAnimationFrame(monitorFrame);
    return () => cancelAnimationFrame(frameId);
  }, [securityLock]);

  useEffect(() => {
    fetchResume();
    return () => { 
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
      if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
      if (securityLockTimeout.current) clearTimeout(securityLockTimeout.current);
    };
  }, [fetchResume]);

  const handleSecurityViolation = (reason: string) => {
    setSecurityLock(true);
    setIsHolding(false);
    setPulseActive(false);
    if (securityLockTimeout.current) clearTimeout(securityLockTimeout.current);
    securityLockTimeout.current = setTimeout(() => setSecurityLock(false), 5000); // 5 sec lockdown
  };

  // Anti-Screenshot & Focus Protections
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
      setIsFocused(false);
      setIsHolding(false);
      setPulseActive(false);
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ['p', 's', 'c', 'u'].includes(e.key.toLowerCase())) e.preventDefault();
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 's', 'c'].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        handleSecurityViolation("Hardware Capture Key Triggered");
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handleBlur();
    });
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const triggerPulse = () => {
    if (securityLock) return;
    setPulseActive(true);
    if (pulseTimeout.current) clearTimeout(pulseTimeout.current);
    pulseTimeout.current = setTimeout(() => setPulseActive(false), 1500); // 1.5s clarity pulse
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isHolding) triggerPulse();
    if ('clientX' in e) {
      setMousePos({ x: e.clientX, y: e.clientY });
    } else if ('touches' in e && e.touches[0]) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
      <span className="text-gray-500 font-mono text-sm tracking-tighter uppercase">Securing Asset Buffer...</span>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#020205] flex flex-col items-center justify-center p-6 text-center">
      <ShieldAlert className="w-12 h-12 text-red-500 mb-4" />
      <h1 className="text-xl font-bold text-white mb-2">ACCESS TERMINATED</h1>
      <p className="text-gray-400 max-w-sm text-sm mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.href = '/'}>Return Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020105] text-white flex flex-col overflow-hidden select-none">
      <header className="h-14 border-b border-white/5 bg-black/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="text-xs font-mono text-gray-400 uppercase tracking-[0.3em]">Vault Protocol v5.0 (Interaction-Pulse)</span>
        </div>
        <div className="bg-red-500/10 text-red-500 text-[10px] py-1 px-3 rounded-full border border-red-500/20 font-black uppercase">
          Integrity Monitor: Active
        </div>
      </header>

      <main 
        className="flex-1 relative cursor-default overflow-hidden bg-black flex items-center justify-center"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseDown={() => { setIsHolding(true); triggerPulse(); }}
        onMouseUp={() => { setIsHolding(false); setPulseActive(false); }}
        onTouchStart={() => { setIsHolding(true); triggerPulse(); }}
        onTouchEnd={() => { setIsHolding(false); setPulseActive(false); }}
      >
        <div className="w-full h-full p-2 md:p-4 flex justify-center items-center overflow-hidden relative">
          
          {/* Animated Noise Pattern Layer */}
          <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.1] mix-blend-overlay">
            <div className="noise-bg w-full h-full" />
          </div>

          <div className="relative w-full max-w-4xl h-[92vh] shadow-2xl rounded-sm overflow-hidden bg-black/40 ring-1 ring-white/5">
            
            {/* The Hardened Document Layer */}
            <div 
              className={`w-full h-full transition-all duration-300 ease-linear ${
                pulseActive && isHolding && isFocused && !securityLock
                ? 'blur-0 opacity-100 scale-100' 
                : 'blur-[100px] opacity-5 scale-[0.98]'
              }`}
            >
              <div className="w-full h-full bg-white overflow-hidden pointer-events-none">
                {blobUrl && (
                  <iframe
                    src={`${blobUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                    className="w-full h-full border-none pointer-events-none"
                    title="Resume"
                    loading="eager"
                  />
                )}
              </div>
            </div>

            {/* High-Intensity Traceability Watermark GRID */}
            <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.15] overflow-hidden">
               <div className="grid grid-cols-3 grid-rows-14 h-full w-full gap-8 p-12 -rotate-[20deg] scale-125">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <div key={i} className="text-[11px] font-black uppercase text-black bg-white/30 backdrop-blur-sm px-4 py-1 rounded-sm shadow-sm">
                      {viewerEmail} • AUTH-{token.substring(0,6)}
                    </div>
                  ))}
               </div>
            </div>

            {/* Ultimate Blackout Protection overlay */}
            <AnimatePresence>
              {(securityLock || !isFocused) && (
                <motion.div 
                  initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-[#000] flex flex-col items-center justify-center p-12 text-center"
                >
                  <ShieldAlert className="w-24 h-24 text-red-600 mb-8 animate-[pulse_0.5s_infinite]" />
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic underline decoration-red-600 decoration-8 underline-offset-[12px]">INTEGRITY FAILURE</h2>
                  <p className="text-red-600 text-lg mt-12 font-mono font-black tracking-widest animate-pulse">
                    CAPTURE ATTEMPT DETECTED • SYSTEM LOCKING ASSET
                  </p>
                  <div className="mt-8 text-gray-700 text-[10px] font-mono uppercase tracking-[0.5em]">
                    Lockdown Expires in 5s...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Vault Entry Instruction */}
            <AnimatePresence>
              {!pulseActive && isFocused && !securityLock && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none bg-black/70 backdrop-blur-xl"
                >
                  <motion.div
                    animate={{ scale: [1, 1.02, 1], rotate: [0, 1, -1, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="bg-red-600 text-white px-10 py-5 rounded-sm border-2 border-white/20 shadow-[0_0_80px_rgba(220,38,38,0.4)]"
                  >
                    <span className="font-black text-2xl uppercase tracking-tighter flex flex-col items-center gap-2">
                       <Lock className="w-8 h-8" /> PRESS & HOLD TO DECRYPT PULSE
                       <span className="text-[10px] tracking-[0.2em] font-mono text-white/60">(Valid for 1.5s per interaction)</span>
                    </span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="h-10 border-t border-white/5 bg-black/80 flex items-center justify-center px-6 z-50 text-gray-600 font-mono">
        <p className="text-[8px] uppercase tracking-[0.5em] italic">
          DECRYPTION_MODE: INTERACTION-PULSE-v5 • SYNC: INTEGRAL • USER: {viewerEmail}
        </p>
      </footer>

      <style jsx global>{`
        @media print { body { display: none !important; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .noise-bg {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise-move 0.05s steps(2) infinite;
        }

        @keyframes noise-move {
          0% { transform: translate(0,0) }
          50% { transform: translate(-1px,1px) }
          100% { transform: translate(1px,-1px) }
        }
      `}</style>
    </div>
  );
}
