"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, FileText, Loader2, LockKeyhole } from "lucide-react"
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
      // Pass the client's current origin to the backend so emails always use the correct host
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch("/api/resume/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, origin }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      setStatus("success")
      
      // Auto-close after 4 seconds
      setTimeout(() => {
        setOpen(false)
        // Reset after complete close
        setTimeout(() => setStatus("idle"), 500)
      }, 4000)

    } catch (error: any) {
      console.error("Resume request error:", error)
      setErrorMessage(error.message || "Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-black/90 border-white/10 backdrop-blur-2xl text-white">
        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center p-6 text-center space-y-4"
            >
              <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <DialogTitle className="text-2xl text-emerald-400">Request Sent!</DialogTitle>
              <DialogDescription className="text-gray-400 text-base">
                Aniruddha has been notified. You'll receive an email with the secure download link once approved!
              </DialogDescription>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-violet-500/20 rounded-lg">
                    <LockKeyhole className="h-5 w-5 text-violet-400" />
                  </div>
                  <DialogTitle className="text-xl">Secure Resume Access</DialogTitle>
                </div>
                <DialogDescription className="text-gray-400">
                  Please provide your details below. I'll personally review your request and send access to your email.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Your Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      required 
                      disabled={status === "loading"}
                      placeholder="John Doe" 
                      className="bg-white/5 border-white/10 focus-visible:ring-violet-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Your Email Address</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      disabled={status === "loading"}
                      placeholder="john@example.com" 
                      className="bg-white/5 border-white/10 focus-visible:ring-violet-500"
                    />
                  </div>
                </div>

                {status === "error" && (
                  <div className="text-sm text-red-400 bg-red-400/10 p-3 rounded-md border border-red-400/20">
                    {errorMessage}
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={status === "loading"}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold transition-all"
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
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
