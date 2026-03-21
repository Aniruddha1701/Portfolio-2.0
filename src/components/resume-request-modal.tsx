"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, FileText, Loader2, LockKeyhole, Mail, User, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ResumeRequestModalProps {
  children: React.ReactNode
}

export function ResumeRequestModal({ children }: ResumeRequestModalProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMessage("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch("/api/resume/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, origin }),
      })

      const data = await res.json()

      if (!res.ok || (data.success === false)) {
        throw new Error(data.error || "Failed to submit request")
      }

      setStatus("success")
      
      setTimeout(() => {
        setOpen(false)
        setTimeout(() => setStatus("idle"), 500)
      }, 4000)

    } catch (error: any) {
      console.error("Resume request error:", error)
      setErrorMessage(error.message || "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  const handleOpen = () => setOpen(true)

  return (
    <>
      <div onClick={handleOpen} className="cursor-pointer">
        {children}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[480px] bg-black/95 border-white/10 backdrop-blur-3xl text-white p-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="p-10 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", duration: 0.6, bounce: 0.5 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-emerald-500/30"
              >
                <CheckCircle2 className="h-12 w-12 text-white" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-3"
              >
                Request Sent!
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-base leading-relaxed"
              >
                Your request has been submitted. You&apos;ll receive an email with the secure download link once approved!
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500"
              >
                <Sparkles className="h-4 w-4" />
                <span>Usually responds within 24 hours</span>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
            >
              {/* Gradient top bar */}
              <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600" />

              <div className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.6, bounce: 0.4 }}
                    className="w-16 h-16 bg-gradient-to-br from-violet-600 to-pink-600 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-lg shadow-purple-500/25"
                  >
                    <LockKeyhole className="h-8 w-8 text-white" />
                  </motion.div>
                  
                  <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl font-bold text-white mb-2"
                  >
                    Secure Resume Access
                  </motion.h2>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-400 text-sm leading-relaxed"
                  >
                    Enter your details to request access. I&apos;ll personally review and send a secure link to your email.
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="name" className="text-gray-300 text-sm font-medium ml-1">Full Name</Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <Input 
                        id="name" 
                        name="name" 
                        required 
                        disabled={status === "loading"}
                        placeholder="John Doe" 
                        className="pl-11 h-12 bg-white/5 border-white/10 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 text-white placeholder:text-gray-500 transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="email" className="text-gray-300 text-sm font-medium ml-1">Email Address</Label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-purple-400 transition-colors">
                        <Mail className="h-4 w-4" />
                      </div>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        required 
                        disabled={status === "loading"}
                        placeholder="john@example.com" 
                        className="pl-11 h-12 bg-white/5 border-white/10 focus-visible:ring-purple-500 focus-visible:border-purple-500/50 text-white placeholder:text-gray-500 transition-all"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {status === "error" && (
                      <div className="text-sm text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 flex items-start gap-3">
                        <div className="mt-0.5">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <span>{errorMessage}</span>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button 
                      type="submit" 
                      disabled={status === "loading"}
                      className="w-full h-12 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold transition-all duration-300 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Request...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Request Access
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>

                {/* Footer note */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-center text-gray-500 text-xs mt-6 flex items-center justify-center gap-1"
                >
                  <LockKeyhole className="h-3 w-3" />
                  Your information is secure and private
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
    </>
  )
}
