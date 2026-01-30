"use client"

import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { useState, useEffect } from "react"
import { Menu, X, Home, User, Briefcase, Award, BookOpen, Trophy, FlaskConical, Settings, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "About", href: "#about", icon: User },
  { label: "Skills", href: "#skills", icon: Award },
  { label: "Portfolio", href: "#portfolio", icon: Briefcase },
  { label: "Certifications", href: "#certifications", icon: Trophy },
  { label: "Smart Lab", href: "#smart-lab", icon: FlaskConical },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const { scrollY, scrollYProgress } = useScroll()
  const navOpacity = useTransform(scrollY, [0, 100], [0.7, 1])
  const navBlur = useTransform(scrollY, [0, 100], [10, 20])

  // Smooth scroll progress for indicator
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.slice(1))
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsOpen(false)
  }

  return (
    <>
      {/* Scroll Progress Indicator - Top of viewport */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Desktop Navigation */}
      <motion.nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden md:block"
        style={{
          opacity: navOpacity,
          backdropFilter: `blur(${navBlur}px)`,
        }}
      >
        <div className="glass-morphism rounded-full px-6 py-3 border border-white/10 flex items-center gap-4 shadow-lg shadow-black/5">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.label}>
                <motion.button
                  onClick={() => scrollToSection(item.href)}
                  className={cn(
                    "relative flex items-center gap-2 text-sm font-medium transition-all duration-300 group",
                    activeSection === item.href.slice(1)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className={cn(
                      "transition-all duration-300",
                      activeSection === item.href.slice(1) ? "scale-110" : "group-hover:scale-110"
                    )}
                    animate={activeSection === item.href.slice(1) ? { rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.span>
                  <span>{item.label}</span>
                  {activeSection === item.href.slice(1) && (
                    <motion.div
                      layoutId="activeSection"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                      style={{
                        boxShadow: "0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)"
                      }}
                      transition={{ type: "spring", bounce: 0.2 }}
                    />
                  )}
                </motion.button>
              </li>
            ))}
          </ul>
          {/* Admin Button Separator */}
          <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          {/* Admin Button */}
          <motion.a
            href="/admin/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 text-primary border border-primary/20 hover:border-primary/40 transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Admin</span>
          </motion.a>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="glass-morphism p-3 rounded-full"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.div>
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        initial={false}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />
        <motion.nav
          className="absolute top-20 left-4 right-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{
            y: isOpen ? 0 : -20,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="glass-morphism rounded-2xl p-6">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{
                    x: isOpen ? 0 : -20,
                    opacity: isOpen ? 1 : 0,
                  }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "flex items-center gap-3 text-lg font-medium w-full p-3 rounded-lg transition-all",
                      activeSection === item.href.slice(1)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </motion.li>
              ))}
              {/* Admin Button in Mobile Menu */}
              <motion.li
                initial={{ x: -20, opacity: 0 }}
                animate={{
                  x: isOpen ? 0 : -20,
                  opacity: isOpen ? 1 : 0,
                }}
                transition={{ duration: 0.3, delay: navItems.length * 0.05 }}
                className="pt-4 mt-4 border-t border-white/10"
              >
                <a
                  href="/admin/login"
                  className="flex items-center gap-3 text-lg font-medium w-full p-3 rounded-lg transition-all bg-primary/10 hover:bg-primary/20 text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  <Lock className="w-5 h-5" />
                  <span>Admin Portal</span>
                </a>
              </motion.li>
            </ul>
          </div>
        </motion.nav>
      </motion.div>
    </>
  )
}
