"use client"

import { motion } from "framer-motion"

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orb 1 */}
      <motion.div
        className="absolute w-96 h-96 -top-10 -left-10 opacity-50"
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 blur-3xl" />
      </motion.div>

      {/* Gradient Orb 2 */}
      <motion.div
        className="absolute w-72 h-72 top-1/4 right-10 opacity-40"
        animate={{
          x: [0, -150, 0],
          y: [0, 150, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 blur-3xl" />
      </motion.div>

      {/* Gradient Orb 3 */}
      <motion.div
        className="absolute w-80 h-80 bottom-10 left-1/3 opacity-30"
        animate={{
          x: [0, 200, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-green-400 via-teal-500 to-blue-600 blur-3xl" />
      </motion.div>

      {/* Gradient Orb 4 */}
      <motion.div
        className="absolute w-64 h-64 top-2/3 right-1/4 opacity-40"
        animate={{
          x: [0, -100, 0],
          y: [0, -200, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 blur-3xl" />
      </motion.div>

      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 mesh-gradient animate-pulse-slow" />
      </div>
    </div>
  )
}
