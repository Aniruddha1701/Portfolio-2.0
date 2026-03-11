"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"
import { ArrowRight, Download, Send, Sparkles } from "lucide-react"
import { ResumeRequestModal } from "@/components/resume-request-modal"
import { Button } from "./ui/button"

interface HeroEnhancedProps {
  name: string
  city?: string
  title: string
  bio: string
  hasResume?: boolean
}

export default function HeroEnhanced({ name, city, title, bio, hasResume = false }: HeroEnhancedProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smoother, heavier feel for professional 3D effect
  const springConfig = { damping: 30, stiffness: 200, mass: 2 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect()
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // SUBTLE rotation logic - less is more for "Professional" look
  const rotateX = useTransform(y, [-0.5, 0.5], [2, -2])
  const rotateY = useTransform(x, [-0.5, 0.5], [-2, 2])

  const words = title.split(" ")

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Multi-layered background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/30 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* Animated gradient mesh orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
          animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-pink-500/8 blur-[80px]"
          animate={{ x: [0, 40, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* 3D Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 max-w-5xl mx-auto px-6"
      >
        <div className="text-center space-y-8" style={{ transform: "translateZ(30px)" }}>
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-gray-300 tracking-wide">
              Available for opportunities
            </span>
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          </motion.div>

          {/* Name With 3D Letter Effect */}
          <div className="relative cursor-default perspective-1000">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight font-headline flex justify-center flex-wrap"
            >
              {name.split('').map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-500 hover:to-violet-400"
                  whileHover={{ 
                    y: -15, 
                    rotateX: 20, 
                    rotateY: letter !== ' ' ? (index % 2 === 0 ? 15 : -15) : 0, 
                    scale: 1.1,
                    textShadow: "0px 10px 20px rgba(139, 92, 246, 0.5), 0px -5px 15px rgba(255, 255, 255, 0.3)" 
                  }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  style={{
                    // Preserve space character width
                    minWidth: letter === ' ' ? '1rem' : 'auto'
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
            {/* Glow behind name */}
            <div className="absolute inset-0 text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight font-headline text-violet-500/20 blur-2xl -z-10 select-none flex justify-center flex-wrap" aria-hidden>
              {name.split('').map((letter, i) => <span key={i} style={{ minWidth: letter === ' ' ? '1rem' : 'auto' }}>{letter}</span>)}
            </div>
          </div>

          {/* Title & Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-2xl md:text-4xl font-light">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={
                    word.includes("(") || word.includes(")")
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400 font-medium"
                      : "text-gray-400"
                  }
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {city && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm md:text-base text-gray-500 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]"
              >
                <svg className="w-3.5 h-3.5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
              </motion.span>
            )}
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed font-light"
          >
            {bio}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center pt-6"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-white hover:bg-gray-100 text-black min-w-[160px] h-14 rounded-full transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] hover:scale-[1.02] font-semibold text-base"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 flex items-center gap-2">
                View Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            {hasResume && (
              <ResumeRequestModal>
                <Button
                  size="lg"
                  variant="outline"
                  className="group relative min-w-[160px] h-14 rounded-full bg-[#110e1b] border-2 border-violet-500/50 hover:bg-[#1a1528] hover:border-violet-400 hover:shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-violet-500/30 transition-all duration-300 font-medium text-base hover:scale-[1.02] overflow-hidden"
                >
                  {/* Subtle internal glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center">
                    <Download className="w-4 h-4 mr-2 text-violet-300 group-hover:text-white transition-colors group-hover:-translate-y-0.5" />
                    <span className="text-gray-100 group-hover:text-white transition-colors">Request Resume</span>
                  </span>
                </Button>
              </ResumeRequestModal>
            )}

            <Button
              size="lg"
              variant="outline"
              className="group relative min-w-[160px] h-14 rounded-full bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300 font-medium text-base hover:scale-[1.02]"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Send className="w-4 h-4 mr-2 text-gray-400 group-hover:text-white transition-colors" />
              Contact
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-medium text-gray-600 uppercase tracking-[0.2em]">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-violet-500/50 to-transparent">
            <motion.div
              className="w-full h-1/3 bg-violet-500"
              animate={{ y: [0, 24, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

