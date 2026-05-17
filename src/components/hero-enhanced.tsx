"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"
import { ArrowRight, Download, Send, Sparkles } from "lucide-react"
import { ResumeRequestModal } from "@/components/resume-request-modal"
import { Button } from "./ui/button"
import { FluidParticlesBackground } from "@/components/ui/fluid-particles-background"

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
    <FluidParticlesBackground className="min-h-screen">
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated gradient mesh orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px]"
            animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px]"
            animate={{ x: [0, -50, 0], y: [0, 30, 0], scale: [1.1, 0.9, 1.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-pink-500/8 blur-[80px]"
            animate={{ x: [0, 40, 0], y: [0, 50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            aria-hidden="true"
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
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-secondary/20 border border-border backdrop-blur-xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-sm font-medium text-muted-foreground tracking-wide">
                Available for opportunities
              </span>
              <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
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
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground hover:to-violet-400 hover-glow-letter"
                    whileHover={{ 
                      y: -15, 
                      rotateX: 20, 
                      rotateY: letter !== ' ' ? (index % 2 === 0 ? 15 : -15) : 0, 
                      scale: 1.1,
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
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-violet-600 dark:from-violet-400 to-cyan-600 dark:to-cyan-400 font-medium"
                        : "text-muted-foreground"
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
                  className="text-sm md:text-base text-muted-foreground flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/20 border border-border"
                >
                  <svg className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
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
                className="group relative overflow-hidden bg-primary text-primary-foreground min-w-[170px] h-14 rounded-full transition-all duration-500 hover:scale-[1.05] hover:opacity-90 hover:shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)] font-semibold text-base"
                onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {/* Sweeping shine effect */}
                <div className="absolute inset-0 -translate-x-[150%] skew-x-[30deg] bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:duration-1000 group-hover:translate-x-[150%] transition-transform ease-out" />
                
                <span className="relative z-10 flex items-center gap-2">
                  View Work
                  <motion.div 
                    className="relative flex items-center justify-center w-5 h-5 overflow-hidden"
                  >
                    <ArrowRight className="absolute w-4 h-4 transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0" />
                    <ArrowRight className="absolute w-4 h-4 -translate-x-5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-foreground dark:text-white" />
                  </motion.div>
                </span>
              </Button>

              {hasResume && (
                <ResumeRequestModal>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative min-w-[170px] h-14 rounded-full bg-background border-2 border-violet-500/30 hover:bg-secondary/40 hover:border-violet-400 text-base font-medium transition-all duration-500 hover:scale-[1.05] overflow-hidden hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)]"
                  >
                    {/* Expanding radiant glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20" />
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-full bg-violet-400/30 blur-2xl rounded-full" />
                    </div>
                    
                    <span className="relative z-10 flex items-center">
                      <motion.div
                         className="mr-2"
                         animate={{ y: [0, -3, 0] }}
                         transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Download className="w-4 h-4 text-violet-600 dark:text-violet-400 transition-colors" />
                      </motion.div>
                      <span className="text-foreground transition-colors font-semibold">Request Resume</span>
                    </span>
                  </Button>
                </ResumeRequestModal>
              )}

              <Button
                size="lg"
                variant="outline"
                className="group relative overflow-hidden min-w-[170px] h-14 rounded-full bg-secondary/10 border border-border hover:bg-secondary/20 hover:border-cyan-500/50 transition-all duration-500 font-medium text-base hover:scale-[1.05] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <span className="relative z-10 flex items-center">
                  <motion.div 
                    className="relative w-5 h-5 mr-2 overflow-hidden flex items-center justify-center"
                  >
                     <Send className="absolute w-4 h-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-5 group-hover:-translate-y-5 group-hover:opacity-0" />
                     <Send className="absolute w-4 h-4 text-cyan-600 dark:text-cyan-400 -translate-x-5 translate-y-5 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </motion.div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors font-semibold">Contact</span>
                </span>
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
          aria-label="Scroll down"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.2em]">Scroll</span>
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
    </FluidParticlesBackground>
  )
}
