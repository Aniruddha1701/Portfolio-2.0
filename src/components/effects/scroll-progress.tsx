"use client"

import { motion, useScroll, useSpring } from "framer-motion"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  
  // Spring physics for smooth progress filling
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 origin-left z-[100] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500"
      style={{ scaleX }}
    >
      {/* Optional: Add a subtle glow under the bar */}
      <div className="absolute inset-0 blur-[2px] opacity-50 bg-inherit" />
    </motion.div>
  )
}
