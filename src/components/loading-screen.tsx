"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { DotLoader } from "@/components/ui/dot-loader"

interface LoadingScreenProps {
  onComplete?: () => void
}

// Retro arcade game animation frames (7x7 grid indices)
const gameFrames = [
  [14, 7, 0, 8, 6, 13, 20],
  [14, 7, 13, 20, 16, 27, 21],
  [14, 20, 27, 21, 34, 24, 28],
  [27, 21, 34, 28, 41, 32, 35],
  [34, 28, 41, 35, 48, 40, 42],
  [34, 28, 41, 35, 48, 42, 46],
  [34, 28, 41, 35, 48, 42, 38],
  [34, 28, 41, 35, 48, 30, 21],
  [34, 28, 41, 48, 21, 22, 14],
  [34, 28, 41, 21, 14, 16, 27],
  [34, 28, 21, 14, 10, 20, 27],
  [28, 21, 14, 4, 13, 20, 27],
  [28, 21, 14, 12, 6, 13, 20],
  [28, 21, 14, 6, 13, 20, 11],
  [28, 21, 14, 6, 13, 20, 10],
  [14, 6, 13, 20, 9, 7, 21],
]

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<"loading" | "ready" | "exit">("loading")

  // Simulate loading progress with variable steps
  useEffect(() => {
    if (phase !== "loading") return

    const totalDuration = 2400
    const intervalTime = 30
    const baseIncrement = 100 / (totalDuration / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + baseIncrement * (0.5 + Math.random() * 1.0)
        if (next >= 100) {
          clearInterval(timer)
          setPhase("ready")
          setTimeout(() => {
            setPhase("exit")
            setTimeout(() => onComplete?.(), 800)
          }, 450)
          return 100
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [phase, onComplete])

  // Lock scroll while loading screen is present
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
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden select-none bg-neutral-950 dark:bg-neutral-950"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.03,
            filter: "blur(12px)",
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Subtle radial ambient background glow behind the loader */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_60%)] pointer-events-none" />

          {/* Premium Floating Center Container */}
          <motion.div
            className="relative flex flex-col items-center p-8 rounded-2xl bg-neutral-900/40 border border-white/5 backdrop-blur-md shadow-2xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Dot Loader & Playing HUD panel */}
            <div className="flex items-center gap-5 rounded-lg bg-black/60 px-5 py-4 border border-white/5 shadow-inner">
              <div className="relative">
                {/* Mini background shadow glow under the dots */}
                <div className="absolute inset-0 bg-indigo-500/20 blur-sm rounded-sm pointer-events-none" />
                <DotLoader
                  frames={gameFrames}
                  duration={90}
                  className="gap-0.5 relative z-10"
                  dotClassName="bg-white/10 [&.active]:bg-indigo-400 size-1.5 transition-colors duration-75"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  <p className="font-mono text-xs tracking-wider text-neutral-400 font-semibold uppercase">Playing</p>
                </div>
                <p className="font-mono text-[9px] text-neutral-500 tracking-tight">RETRO_ARCADE.SYS</p>
              </div>
            </div>

            {/* Fading text messages below the loader panel */}
            <div className="mt-8 flex flex-col items-center gap-2">
              <motion.p 
                className="text-xs font-mono tracking-widest text-neutral-400 uppercase h-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {phase === "ready" ? (
                  <motion.span
                    className="text-emerald-400 font-semibold"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    SYSTEM READY
                  </motion.span>
                ) : progress < 40 ? (
                  <span>INITIALIZING BOOT...</span>
                ) : progress < 75 ? (
                  <span>LOADING SHADCN COMPILERS...</span>
                ) : (
                  <span>OPTIMIZING ASSETS...</span>
                )}
              </motion.p>

              {/* Progress percentage value */}
              <p className="font-mono text-[10px] text-neutral-500">
                {Math.floor(progress)}%
              </p>
            </div>

            {/* Ultra-slim dynamic gradient progress bar */}
            <div className="w-48 h-[2px] bg-neutral-800 rounded-full mt-4 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
