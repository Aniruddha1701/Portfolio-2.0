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
        /* Hide default cursor on desktop, but keep it on interactive elements if you prefer, 
           or hide it everywhere. Let's hide it everywhere for the full custom feel. */
        @media (hover: hover) and (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}} />

      <motion.div
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-violet-400 pointer-events-none z-[9999] mix-blend-screen"
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
          backgroundColor: isHovering ? "rgba(139, 92, 246, 0.2)" : "rgba(139, 92, 246, 1)",
          boxShadow: isHovering 
            ? "0 0 20px rgba(139, 92, 246, 0.4), inset 0 0 10px rgba(139, 92, 246, 0.6)" 
            : "0 0 10px rgba(139, 92, 246, 0.8)",
          border: isHovering ? "1px solid rgba(139, 92, 246, 0.8)" : "none"
        }}
        transition={{
          scale: { duration: 0.2 },
          backgroundColor: { duration: 0.2 },
        }}
      />
      {/* Outer trailing ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-violet-500/30 pointer-events-none z-[9998]"
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
