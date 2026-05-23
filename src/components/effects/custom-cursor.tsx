"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Mouse position
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth springing for the dot
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  // Springing for the outer ring (slower, more delayed)
  const outerSpringConfig = { damping: 40, stiffness: 200, mass: 1 }
  const outerX = useSpring(mouseX, outerSpringConfig)
  const outerY = useSpring(mouseY, outerSpringConfig)

  useEffect(() => {
    setIsMounted(true)

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if hovering over interactive elements
      const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]')
      setIsHovering(!!isInteractive)
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", updateHoverState)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", updateHoverState)
    }
  }, [mouseX, mouseY])

  // Don't render on the server or on touch devices
  if (!isMounted) return null

  // A simple way to check if device supports hover (CSS media query equivalent in JS)
  if (typeof window !== 'undefined' && window.matchMedia("(hover: none)").matches) {
    return null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* Hide default cursor on desktop */
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }

        /* Theme-adaptive cursor colors — LIGHT MODE (default) */
        .custom-cursor-dot {
          background: rgb(91, 33, 182) !important;  /* violet-800 — bold on white */
          box-shadow: 0 0 16px rgba(91, 33, 182, 0.7), 0 0 6px rgba(91, 33, 182, 1) !important;
        }
        .custom-cursor-dot.hovering {
          background: rgba(91, 33, 182, 0.12) !important;
          box-shadow: 0 0 30px rgba(91, 33, 182, 0.5), inset 0 0 14px rgba(91, 33, 182, 0.4) !important;
          border: 2px solid rgba(91, 33, 182, 0.8) !important;
        }
        .custom-cursor-ring {
          border-color: rgba(91, 33, 182, 0.45) !important;
        }

        /* DARK MODE */
        .dark .custom-cursor-dot {
          background: rgba(167, 139, 250, 1) !important;  /* violet-400 */
          box-shadow: 0 0 14px rgba(139, 92, 246, 0.8), 0 0 4px rgba(167, 139, 250, 0.9) !important;
        }
        .dark .custom-cursor-dot.hovering {
          background: rgba(139, 92, 246, 0.15) !important;
          box-shadow: 0 0 24px rgba(139, 92, 246, 0.5), inset 0 0 12px rgba(139, 92, 246, 0.6) !important;
          border: 1.5px solid rgba(139, 92, 246, 0.8) !important;
        }
        .dark .custom-cursor-ring {
          border-color: rgba(139, 92, 246, 0.3) !important;
        }
      `}} />

      {/* Inner dot */}
      <motion.div
        className={`custom-cursor-dot fixed top-0 left-0 w-4 h-4 rounded-full pointer-events-none z-[9999] ${isHovering ? 'hovering' : ''}`}
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: 1,
          scale: isHovering ? 3 : 1,
        }}
        transition={{
          scale: { duration: 0.2 },
        }}
      />
      {/* Outer trailing ring */}
      <motion.div
        className="custom-cursor-ring fixed top-0 left-0 w-8 h-8 rounded-full border pointer-events-none z-[9998]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isHovering ? 0 : 1,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  )
}
