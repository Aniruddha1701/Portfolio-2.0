"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useEffect, useState } from "react"
import { ArrowRight, Sparkles, Download, Send } from "lucide-react"
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
  
  const springConfig = { damping: 25, stiffness: 150 }
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

  const rotateX = useTransform(y, [-0.5, 0.5], [5, -5])
  const rotateY = useTransform(x, [-0.5, 0.5], [-5, 5])

  const words = title.split(" ")

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 animate-pulse-slow" />
      
      {/* 3D Card Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative z-10 max-w-5xl mx-auto px-6"
      >
        {/* Floating decoration */}
        <motion.div
          className="absolute -top-20 -right-20 w-40 h-40"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Sparkles className="w-full h-full text-primary/20" />
        </motion.div>

        {/* Main content */}
        <div className="text-center space-y-8" style={{ transform: "translateZ(50px)" }}>
          {/* Animated greeting */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative inline-block"
          >
            <span className="text-sm md:text-base font-medium text-primary/80 tracking-widest uppercase">
              Welcome to my portfolio
            </span>
            <motion.div
              className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </motion.div>

          {/* Animated Name */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <span className="text-5xl md:text-7xl lg:text-8xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 animate-gradient">
                {name}
              </span>
            </span>
            
            {/* Glow effect */}
            <div className="absolute inset-0 blur-3xl opacity-30">
              <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary">
                {name}
              </span>
            </div>
          </motion.h1>

          {/* City */}
          {city && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground/70 -mt-4"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {city}
              </span>
            </motion.div>
          )}

          {/* Animated Title */}
          <motion.div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {words.map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                className="text-2xl md:text-4xl font-light text-muted-foreground"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          {/* Bio with typing effect */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground/80 leading-relaxed"
          >
            {bio}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap gap-4 justify-center mt-8"
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              onClick={() => {
                document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Button>

            {hasResume && (
              <Button
                size="lg"
                variant="outline"
                className="group border-primary/30 hover:border-primary glass-effect"
                onClick={async () => {
                  try {
                    const response = await fetch('/api/resume/download');
                    if (response.ok) {
                      window.open('/api/resume/download', '_blank');
                    } else {
                      console.error('Resume not available');
                    }
                  } catch (error) {
                    console.error('Error downloading resume:', error);
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
            )}

            <Button
              size="lg"
              variant="outline"
              className="group border-primary/30 hover:border-primary glass-effect"
            >
              <Send className="w-4 h-4 mr-2" />
              Contact Me
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground/60"
        >
          <span className="text-sm">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-2 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
