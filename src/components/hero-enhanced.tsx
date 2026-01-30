"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect } from "react"
import { ArrowRight, Download, Send, Sparkles } from "lucide-react"
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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/20 via-background to-background">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      {/* 3D Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 max-w-5xl mx-auto px-6"
      >
        {/* Abstract minimalistic decoration */}
        <motion.div
          className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="text-center space-y-8" style={{ transform: "translateZ(30px)" }}>
          {/* Welcome Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-white/5 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs md:text-sm font-medium text-muted-foreground tracking-wide uppercase">
              Portfolio 2.0
            </span>
          </motion.div>

          {/* Name */}
          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight font-headline"
            >
              <span className="text-gradient text-glow drop-shadow-2xl">
                {name}
              </span>
            </motion.h1>
          </div>

          {/* Title & Location */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-2xl md:text-4xl font-light text-muted-foreground">
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>

            {city && (
              <span className="text-sm md:text-base text-muted-foreground/60 flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
              </span>
            )}
          </motion.div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground/80 leading-relaxed font-light"
          >
            {bio}
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center pt-8"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground min-w-[160px] h-12 rounded-full transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/40 shimmer-btn"
              onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="relative z-10 flex items-center gap-2">
                View Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>

            {hasResume && (
              <Button
                size="lg"
                variant="outline"
                className="group min-w-[160px] h-12 rounded-full border-white/10 hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/resume/download');
                    if (response.ok) window.open('/api/resume/download', '_blank');
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                Resume
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="min-w-[160px] h-12 rounded-full border-white/10 hover:bg-white/5 backdrop-blur-sm"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Send className="w-4 h-4 mr-2" />
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
        <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary/50 to-transparent">
          <motion.div
            className="w-full h-1/2 bg-primary"
            animate={{ y: [0, 32, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  )
}

