"use client"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Award, Briefcase, FlaskConical, Home, Lock, Menu, Trophy, User, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const navItems = [
    { label: "Home", href: "#home", icon: Home },
    { label: "About", href: "#about", icon: User },
    { label: "Skills", href: "#skills", icon: Award },
    { label: "My Work", href: "#portfolio", icon: Briefcase },
    { label: "Certifications", href: "#certifications", icon: Trophy },
]

export default function FloatingNavbar() {
    const [activeSection, setActiveSection] = useState("home")
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    const { scrollY, scrollYProgress } = useScroll()

    // Transform values for "Smart Dynamic Island" feel
    const width = useTransform(scrollY, [0, 100], ["90%", "auto"])
    const y = useTransform(scrollY, [0, 100], [20, 20])
    const padding = useTransform(scrollY, [0, 100], ["1.5rem", "0.75rem"])

    // Smooth progress bar
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)

            const sections = navItems.map(item => item.href.slice(1))
            const current = sections.find(section => {
                const element = document.getElementById(section)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    const offset = window.innerHeight * 0.3 // Trigger when section is 30% up screen
                    return rect.top <= offset && rect.bottom >= offset
                }
                return false
            })
            if (current) setActiveSection(current)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToSection = (href: string) => {
        const element = document.getElementById(href.slice(1))
        element?.scrollIntoView({ behavior: "smooth" })
        setIsOpen(false)
    }

    return (
        <>
            {/* Scroll Progress Indicator - Top of viewport */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary z-[100] origin-left"
                style={{ scaleX }}
            />

            {/* Desktop Floating Navbar */}
            <motion.nav
                role="navigation"
                aria-label="Main navigation"
                className="fixed top-0 left-1/2 -translate-x-1/2 z-50 hidden md:flex items-center justify-center pointer-events-none"
                style={{ y, width }}
            >
                <motion.div
                    className={cn(
                        "pointer-events-auto flex items-center gap-1 rounded-full transition-all duration-500 ease-spring",
                        isScrolled
                            ? "glass-morphism border-white/5 bg-background/60 shadow-2xl shadow-black/20"
                            : "bg-transparent border-transparent shadow-none"
                    )}
                    style={{ padding }}
                    layout
                >
                    <ul className="flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive = activeSection === item.href.slice(1)

                            return (
                                <li key={item.label} className="relative">
                                    <motion.button
                                        onClick={() => scrollToSection(item.href)}
                                        aria-current={isActive ? "page" : undefined}
                                        className={cn(
                                            "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                                            isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                        )}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-primary rounded-full -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="flex items-center gap-2">
                                            {/* Icon only shows on hover or active to keep it clean, OR always show if space permits. 
                           Let's show only on active for minimized look when scrolled? No, cleaner to always show or only text. 
                           Let's do Icon + Text but ensure layout handles it well. */}
                                            <item.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-current")} />
                                            {item.label}
                                        </span>
                                    </motion.button>
                                </li>
                            )
                        })}
                    </ul>

                    {/* Separator */}
                    <div className="mx-2 w-px h-6 bg-border/50" />

                    {/* Admin Button */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link
                            href="/admin/login"
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                                "bg-secondary/50 hover:bg-secondary text-secondary-foreground border border-white/5"
                            )}
                        >
                            <Lock className="w-4 h-4" />
                            <span>Admin</span>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.nav>

            {/* Mobile Navigation Toggle */}
            <div className="fixed top-4 right-4 z-50 md:hidden">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    className="glass-effect p-3 rounded-full text-foreground shadow-lg"
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="menu"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                            >
                                <Menu className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-40 md:hidden bg-black/60 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.nav
                            aria-label="Mobile navigation menu"
                            className="absolute top-20 left-4 right-4 glass-morphism rounded-3xl p-4 overflow-hidden"
                            initial={{ y: -50, scale: 0.9, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            exit={{ y: -50, scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ul className="flex flex-col gap-2">
                                {navItems.map((item, index) => (
                                    <motion.li
                                        key={item.label}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <button
                                            onClick={() => scrollToSection(item.href)}
                                            className={cn(
                                                "flex items-center gap-4 w-full p-4 rounded-xl text-lg font-medium transition-all",
                                                activeSection === item.href.slice(1)
                                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                    : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className="w-5 h-5" />
                                            {item.label}
                                        </button>
                                    </motion.li>
                                ))}

                                <motion.li
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: navItems.length * 0.05 }}
                                    className="mt-2 pt-2 border-t border-white/10"
                                >
                                    <Link
                                        href="/admin/login"
                                        className="flex items-center gap-4 w-full p-4 rounded-xl text-lg font-medium hover:bg-white/5 text-muted-foreground hover:text-foreground transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <Lock className="w-5 h-5" />
                                        Admin Portal
                                    </Link>
                                </motion.li>
                            </ul>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
