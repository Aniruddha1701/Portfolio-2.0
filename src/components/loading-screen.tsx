"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import LoadingSpinner from "@/components/ui/snow-ball-loading-spinner"

interface LoadingScreenProps {
  onComplete?: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "ready" | "exit">("loading")

  // Simulate loading progress
  useEffect(() => {
    if (phase !== "loading") return

    const totalDuration = 2800
    const intervalTime = 30
    const baseIncrement = 100 / (totalDuration / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + baseIncrement * (0.6 + Math.random() * 0.8)
        if (next >= 100) {
          clearInterval(timer)
          setPhase("ready")
          setTimeout(() => {
            setPhase("exit")
            setTimeout(() => onComplete?.(), 800)
          }, 400)
          return 100
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [phase, onComplete])

  // Lock scroll while loading
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <AnimatePresence>
      {phase !== "exit" && (
        <motion.div
          key="loading-screen"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ backgroundColor: "var(--pl-bg)" }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
            transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Snowball Spinner */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <LoadingSpinner />
          </motion.div>

          {/* Progress text below spinner */}
          <motion.div
            className="mt-8 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="text-sm font-mono tracking-widest text-slate-500 uppercase">
              {phase === "ready" ? (
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  Ready
                </motion.span>
              ) : (
                <span>Loading… {Math.floor(progress)}%</span>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
