"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState, useCallback, useRef, memo, useMemo } from "react"
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"

interface LoadingScreenProps {
  onComplete?: () => void
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

/**
 * Isolated scramble text — runs outside React render cycle via rAF.
 * Zero re-renders. Pure DOM mutation for 60fps decode effect.
 */
const ScrambleText = memo(function ScrambleText({
  text,
  delay = 0,
  speed = 2,
  onDone,
}: {
  text: string
  delay?: number
  speed?: number
  onDone?: () => void
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let iteration = 0
    const totalLen = text.length
    const framesPerChar = speed

    const animate = () => {
      let result = ""
      for (let i = 0; i < totalLen; i++) {
        if (text[i] === " " || text[i] === "." || text[i] === "/" || text[i] === "-") {
          result += text[i]
        } else if (i < Math.floor(iteration / framesPerChar)) {
          result += text[i]
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)]
        }
      }
      el.textContent = result
      iteration++

      if (Math.floor(iteration / framesPerChar) <= totalLen) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        el.textContent = text
        onDone?.()
      }
    }

    const timer = setTimeout(() => {
      frameRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frameRef.current)
    }
  }, [text, delay, speed, onDone])

  return <span ref={ref} className="inline-block">{text}</span>
})

/**
 * Morphing geometric shape — mirrors the favicon's diamond/triangle/square morph.
 * Pure SVG + CSS animation, no JS overhead.
 */
const MorphShape = memo(function MorphShape() {
  return (
    <motion.div
      className="relative w-16 h-16 sm:w-20 sm:h-20"
      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.4))" }}
      >
        <style>{`
          @keyframes morph-path {
            0%, 100% { d: path("M50 15 L85 50 L50 85 L15 50 Z"); }
            33% { d: path("M50 20 L80 75 L20 75 Z"); }
            66% { d: path("M22 22 L78 22 L78 78 L22 78 Z"); }
          }
          .shape-morph {
            animation: morph-path 4s ease-in-out infinite;
            fill: hsl(var(--primary) / 0.15);
            stroke: hsl(var(--primary));
            stroke-width: 2;
          }
        `}</style>
        <path className="shape-morph" d="M50 15 L85 50 L50 85 L15 50 Z" />
      </svg>

      {/* Orbital dot */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary"
          style={{ boxShadow: "0 0 8px hsl(var(--primary) / 0.6)" }}
        />
      </motion.div>
    </motion.div>
  )
})

/**
 * Horizontal line that draws itself — used as a visual divider.
 */
const DrawLine = memo(function DrawLine({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="w-16 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    />
  )
})

/**
 * Counter display — shows elapsed time during load.
 */
const ElapsedCounter = memo(function ElapsedCounter() {
  const ref = useRef<HTMLSpanElement>(null)
  const startRef = useRef(Date.now())
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      const el = ref.current
      if (!el) return
      const elapsed = ((Date.now() - startRef.current) / 1000).toFixed(1)
      el.textContent = `${elapsed}s`
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return <span ref={ref} className="tabular-nums">0.0s</span>
})

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<"intro" | "ready" | "exit">("intro")

  const handleScrambleDone = useCallback(() => {
    // After the name finishes decoding, wait briefly then begin exit
    const timer = setTimeout(() => {
      setPhase("ready")
      setTimeout(() => {
        setPhase("exit")
        setTimeout(() => {
          onComplete?.()
          document.body.style.overflow = ""
        }, 900)
      }, 600)
    }, 500)
    return () => clearTimeout(timer)
  }, [onComplete])

  // Lock scroll during loading
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <AnimatePresence>
      {phase !== "exit" ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: "blur(16px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Animated gradient background — breathing radial gradient */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <AnimatedGradientBackground
              Breathing={true}
              startingGap={130}
              animationSpeed={0.015}
              breathingRange={8}
              topOffset={15}
              gradientColors={[
                "hsl(var(--background))",
                "#1a1a2e",
                "#16213e",
                "#0f3460",
                "#533483",
                "#e94560",
                "#0f3460"
              ]}
              gradientStops={[30, 45, 55, 65, 75, 85, 100]}
              containerClassName="opacity-40 dark:opacity-60"
            />
          </div>

          {/* Noise texture — fixed overlay */}
          <div
            className="fixed inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay z-50"
            aria-hidden="true"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Content stack */}
          <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8">
            {/* Morphing logo */}
            <MorphShape />

            {/* Horizontal rule */}
            <DrawLine delay={0.6} />

            {/* Name reveal — single, confident decode */}
            <div className="flex flex-col items-center gap-2">
              <motion.h1
                className="text-2xl sm:text-3xl lg:text-4xl font-headline font-semibold tracking-tight text-foreground"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <ScrambleText
                  text="Aniruddha Patil"
                  delay={800}
                  speed={2}
                  onDone={handleScrambleDone}
                />
              </motion.h1>

              <motion.p
                className="text-[11px] sm:text-xs font-mono text-muted-foreground/80 dark:text-muted-foreground/50 tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                Portfolio
              </motion.p>
            </div>

            {/* Bottom details — elapsed time + status */}
            <motion.div
              className="flex items-center gap-3 text-[9px] sm:text-[10px] font-mono text-muted-foreground/70 dark:text-muted-foreground/40 tracking-widest uppercase select-none"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.8 }}
            >
              <ElapsedCounter />
              <span className="w-px h-2.5 bg-foreground/20 dark:bg-foreground/10" />
              <motion.span
                animate={
                  phase === "ready"
                    ? { opacity: [0.3, 1, 0.3] }
                    : { opacity: 1 }
                }
                transition={
                  phase === "ready"
                    ? { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
                    : {}
                }
              >
                {phase === "ready" ? "Entering" : "Initializing"}
              </motion.span>
            </motion.div>
          </div>

          {/* Bottom edge line — progress indicator */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary/60 via-accent/40 to-primary/60"
            initial={{ width: "0%" }}
            animate={{
              width: phase === "ready" ? "100%" : "60%",
            }}
            transition={{
              duration: phase === "ready" ? 0.5 : 2.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          />
        </motion.div>
      ) : (
        /* Exit curtain — slides up to reveal site */
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[99999] bg-background pointer-events-none"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
