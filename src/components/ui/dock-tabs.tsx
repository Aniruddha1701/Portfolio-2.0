"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion"
import { Home, User, Award, Briefcase, Trophy } from "lucide-react"

interface DockItem {
  id: string
  name: string
  icon: React.ReactNode
  href: string
  color: string
}

const dockItems: DockItem[] = [
  { id: "home", name: "Home", icon: <Home strokeWidth={1.5} />, href: "#home", color: "bg-zinc-700 dark:bg-zinc-600" },
  { id: "about", name: "About", icon: <User strokeWidth={1.5} />, href: "#about", color: "bg-slate-600 dark:bg-slate-500" },
  { id: "skills", name: "Skills", icon: <Award strokeWidth={1.5} />, href: "#skills", color: "bg-emerald-600 dark:bg-emerald-500" },
  { id: "portfolio", name: "My Work", icon: <Briefcase strokeWidth={1.5} />, href: "#portfolio", color: "bg-blue-600 dark:bg-blue-500" },
  { id: "certifications", name: "Certs", icon: <Trophy strokeWidth={1.5} />, href: "#certifications", color: "bg-amber-600 dark:bg-amber-500" },
]

function DockIcon({
  item,
  mouseY,
  isActive,
  onClick,
}: {
  item: DockItem
  mouseY: ReturnType<typeof useMotionValue<number>>
  isActive: boolean
  onClick: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseY, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 }
    return val - bounds.y - bounds.height / 2
  })

  const sizeSync = useTransform(distance, [-150, 0, 150], [44, 64, 44])
  const size = useSpring(sizeSync, { mass: 0.1, stiffness: 150, damping: 12 })

  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsClicked(false) }}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => { setIsClicked(false); onClick() }}
      className="aspect-square cursor-pointer flex items-center justify-center relative"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-full h-full rounded-2xl shadow-lg flex items-center justify-center text-white relative overflow-hidden ${item.color}`}
        animate={{
          x: isClicked ? -2 : isHovered ? 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          className="text-lg"
          animate={{ scale: isHovered ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {item.icon}
        </motion.div>

        {/* Shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent rounded-2xl"
          animate={{ opacity: isHovered ? 0.35 : 0.1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Tooltip — right side */}
      <motion.div
        initial={{ opacity: 0, x: -10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 16 : -10,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute left-full top-1/2 -translate-y-1/2 ml-2 bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-[11px] font-medium px-2.5 py-1 rounded-lg whitespace-nowrap pointer-events-none backdrop-blur-sm"
      >
        {item.name}
      </motion.div>

      {/* Active dot — right side */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -right-2 w-1 h-1 rounded-full"
        animate={{
          scale: isActive ? 1.5 : isClicked ? 1.2 : 0,
          opacity: isActive ? 1 : 0,
          backgroundColor: isActive ? "hsl(var(--primary))" : "rgba(255,255,255,0.8)",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </motion.div>
  )
}


export function DockTabs() {
  const mouseY = useMotionValue(Infinity)
  const [activeSection, setActiveSection] = useState("home")
  const [visible, setVisible] = useState(false)

  // Show dock after scroll past hero fold
  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 80)

      // Detect active section
      const sections = dockItems
        .filter(i => i.href.startsWith("#"))
        .map(i => i.href.slice(1))

      const current = sections.find(section => {
        const el = document.getElementById(section)
        if (el) {
          const rect = el.getBoundingClientRect()
          const offset = window.innerHeight * 0.3
          return rect.top <= offset && rect.bottom >= offset
        }
        return false
      })
      if (current) setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleClick = useCallback((item: DockItem) => {
    if (item.href.startsWith("#")) {
      const el = document.getElementById(item.href.slice(1))
      el?.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = item.href
    }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-4 top-1/2 -translate-y-1/2 z-50 hidden md:block"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <motion.div
            onMouseMove={(e) => mouseY.set(e.pageY)}
            onMouseLeave={() => mouseY.set(Infinity)}
            className="flex flex-col w-[68px] items-center gap-3 rounded-[2rem] bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl py-4 px-3 border border-zinc-200/40 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {dockItems.map((item) => (
              <DockIcon
                key={item.id}
                item={item}
                mouseY={mouseY}
                isActive={activeSection === item.href.slice(1)}
                onClick={() => handleClick(item)}
              />
            ))}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
