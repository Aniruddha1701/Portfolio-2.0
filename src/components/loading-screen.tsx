"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onComplete?: () => void
}

const words = [
  "Hello.",
  "नमस्ते.",
  "Bonjour.",
  "Ciao.",
  "Hola.",
  "Welcome."
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'loading' | 'exit'>('loading')

  useEffect(() => {
    if (index < words.length - 1) {
      const timer = setTimeout(() => {
        setIndex(index + 1)
      }, index === 0 ? 1000 : 350) // First word stays slightly longer, then rhythmic pacing
      return () => clearTimeout(timer)
    } else {
      // Reached the last word
      const finalTimer = setTimeout(() => {
        setPhase('exit')
        setTimeout(() => {
          onComplete?.()
          // Ensure scrolling is unlocked on edge cases
          document.body.style.overflow = '';
        }, 1200) // Wait for the stunning exit slide animation
      }, 1000)
      return () => clearTimeout(finalTimer)
    }
  }, [index, onComplete])

  // Lock body scroll during loading to prevent jank
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    }
  }, []);

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#030303] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            scale: 1.05,
            filter: "blur(10px)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
        >
          {/* STUNNING AURORA MESH BACKGROUND */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none blur-[100px] opacity-40 mix-blend-screen">
            <motion.div 
              className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-indigo-600/[0.6]"
              animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-emerald-500/[0.5]"
              animate={{ x: [0, -50, 0], y: [0, 80, 0] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-sky-600/[0.5]"
              animate={{ x: [0, 40, 0], y: [0, -60, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Premium Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
            }}
          />

          <div className="relative z-10 flex flex-col items-center">
             {/* ELEGANT TYPOGRAPHY MASKING */}
             <div className="relative h-24 sm:h-32 flex items-center justify-center overflow-hidden px-8">
               <AnimatePresence mode="wait">
                 <motion.div
                   key={index}
                   className="flex items-center gap-4"
                   initial={{ opacity: 0, y: "100%" }}
                   animate={{ opacity: 1, y: "0%" }}
                   exit={{ opacity: 0, y: "-100%" }}
                   transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
                 >
                   <h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white/90 flex items-center">
                     {words[index]}
                   </h1>
                   
                   {/* Elegant pulsing dot for final word */}
                   {index === words.length - 1 && (
                     <motion.div 
                       className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                       initial={{ scale: 0, opacity: 0 }}
                       animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                       transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
                     />
                   )}
                 </motion.div>
               </AnimatePresence>
             </div>

             {/* Minimalist Glassmorphic Progress Bar */}
             <div className="w-48 sm:w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mt-8 relative backdrop-blur-sm">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                />
             </div>
             
             {/* Subtitle / Brand Signature */}
             <motion.div
               className="mt-6 text-[10px] sm:text-xs font-mono text-white/30 tracking-[0.4em] uppercase"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 1 }}
             >
               Loading Experience
             </motion.div>
          </div>

        </motion.div>
      ) : (
        /* ELEGANT EXIT CURTAIN REVEAL */
        <motion.div
          key="curtain"
          className="fixed inset-0 z-[99999] bg-[#030303] pointer-events-none"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
           {/* Final flash of aurora as curtain goes up */}
           <div className="absolute inset-0 overflow-hidden pointer-events-none blur-[100px] opacity-40 mix-blend-screen">
             <div className="absolute -bottom-[20%] left-[20%] w-[70vw] h-[70vw] rounded-full bg-sky-600/[0.5]" />
           </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
