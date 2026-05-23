"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import { createPortal } from "react-dom"

type CurtainPhase = "idle" | "falling" | "rising";
const EASING = "cubic-bezier(0.76, 0, 0.24, 1)";

/**
 * Premium theme toggle — morphing icon with spring physics AND a sweeping curtain full-screen transition.
 * Uses React Portal to render the curtain at the body level to prevent Clipping and Layout Overflow issues.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [phase, setPhase] = React.useState<CurtainPhase>("idle")
  const curtainColorRef = React.useRef<string>("")
  const duration = 550

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const handleToggle = React.useCallback(() => {
    if (phase !== "idle") return
    const nextTheme = isDark ? "light" : "dark"
    
    // Choose premium target background colors that match global theme variables exactly
    curtainColorRef.current = nextTheme === "dark" ? "#09090b" : "#fafafa"
    setPhase("falling")

    setTimeout(() => {
      setTheme(nextTheme)
      setPhase("rising")
      
      setTimeout(() => {
        setPhase("idle")
      }, duration + 60)
    }, duration)
  }, [phase, isDark, setTheme, duration])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-secondary/50 border border-border animate-pulse" />
    )
  }

  const curtainStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: curtainColorRef.current,
    transformOrigin: "top",
    transform: phase === "falling" ? "scaleY(1)" : "scaleY(0)",
    transition: phase !== "idle" ? `transform ${duration}ms ${EASING}` : "none",
    zIndex: 99999, // Render on top of all elements including headers and modals
    pointerEvents: "none",
  }

  return (
    <>
      {mounted && typeof document !== "undefined" && createPortal(
        <div aria-hidden="true" style={curtainStyle} />,
        document.body
      )}
      <motion.button
        onClick={handleToggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-full bg-secondary/60 hover:bg-secondary text-foreground border border-border/50 transition-colors duration-300 overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.svg
              key="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              initial={{ rotate: -90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: 90, scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="m4.93 4.93 1.41 1.41" />
              <path d="m17.66 17.66 1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="m6.34 17.66-1.41 1.41" />
              <path d="m19.07 4.93-1.41 1.41" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              initial={{ rotate: 90, scale: 0, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              exit={{ rotate: -90, scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
