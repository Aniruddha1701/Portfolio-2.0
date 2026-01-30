"use client"

import { ItNews } from './it-news';
import { WordleGame } from './wordle-demo/wordle-game';
import { motion } from "framer-motion"
import { Sparkles, Cpu, Brain, Cloud, Code } from "lucide-react"

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <motion.h2
    className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.h2>
)

const SectionDescription = ({ children }: { children: React.ReactNode }) => (
  <motion.p
    className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.5 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {children}
  </motion.p>
)

// Floating tech icons with orbit animation
const floatingIcons = [
  { Icon: Brain, delay: 0, x: -120, y: -60, color: "text-purple-400" },
  { Icon: Cpu, delay: 1, x: 120, y: -40, color: "text-cyan-400" },
  { Icon: Cloud, delay: 2, x: -100, y: 60, color: "text-pink-400" },
  { Icon: Code, delay: 3, x: 100, y: 80, color: "text-green-400" },
]

export function SmartLab() {
  return (
    <div className="container mx-auto px-4 md:px-6 relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 text-center relative">
        {/* Floating tech icons */}
        {floatingIcons.map(({ Icon, delay, x, y, color }, index) => (
          <motion.div
            key={index}
            className={`absolute hidden md:block ${color}`}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
            animate={{
              y: [y, y - 20, y],
              x: [x, x + 10, x],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6,
              delay: delay * 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="w-8 h-8 opacity-40" />
          </motion.div>
        ))}

        <div className="space-y-2 relative">
          {/* Sparkle decorations */}
          <motion.div
            className="absolute -top-4 -right-8"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sparkles className="w-6 h-6 text-accent" />
          </motion.div>

          <SectionTitle>Smart Lab</SectionTitle>
          <SectionDescription>
            A collection of AI-powered tools to showcase my skills. Here are the latest headlines from the world of IT.
          </SectionDescription>
        </div>
      </div>
      <div className="mt-20 relative z-10 border-t border-white/10 pt-20">
        <div className="text-center mb-12">
          <SectionTitle>Algorithm Lab</SectionTitle>
          <SectionDescription>
            Interactive demonstrations of logic, state management, and algorithm efficiency.
          </SectionDescription>
        </div>
        <WordleGame />
      </div>

      <div className="mt-24 relative z-10 border-t border-white/10 pt-20">
        <ItNews />
      </div>
    </div>
  )
}
