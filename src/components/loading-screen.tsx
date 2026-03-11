"use client"

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState, useRef, useMemo } from "react"

// Code that "writes itself" — actual JSX from the portfolio
const codeLines = [
  { tokens: [{ text: "const", color: "#c678dd" }, { text: " Portfolio", color: "#e5c07b" }, { text: " = ", color: "#abb2bf" }, { text: "() => {", color: "#c678dd" }] },
  { tokens: [{ text: "  const", color: "#c678dd" }, { text: " [ready, setReady]", color: "#e06c75" }, { text: " = ", color: "#abb2bf" }, { text: "useState", color: "#61afef" }, { text: "(", color: "#abb2bf" }, { text: "false", color: "#d19a66" }, { text: ")", color: "#abb2bf" }] },
  { tokens: [{ text: "", color: "#abb2bf" }] },
  { tokens: [{ text: "  useEffect", color: "#61afef" }, { text: "(() => {", color: "#abb2bf" }] },
  { tokens: [{ text: "    loadModules", color: "#61afef" }, { text: "()", color: "#abb2bf" }] },
  { tokens: [{ text: "    connectDatabase", color: "#61afef" }, { text: "()", color: "#abb2bf" }] },
  { tokens: [{ text: "    compileComponents", color: "#61afef" }, { text: "()", color: "#abb2bf" }] },
  { tokens: [{ text: "    setReady", color: "#61afef" }, { text: "(", color: "#abb2bf" }, { text: "true", color: "#d19a66" }, { text: ")", color: "#abb2bf" }] },
  { tokens: [{ text: "  }, [])", color: "#abb2bf" }] },
  { tokens: [{ text: "", color: "#abb2bf" }] },
  { tokens: [{ text: "  return", color: "#c678dd" }, { text: " ready", color: "#e06c75" }, { text: " && ", color: "#c678dd" }, { text: "<", color: "#abb2bf" }, { text: "App", color: "#e5c07b" }, { text: " />", color: "#abb2bf" }] },
  { tokens: [{ text: "}", color: "#c678dd" }] },
]

const greetings = ["Hello", "नमस्ते", "Bonjour", "こんにちは", "Hola", "Ciao", "Olá"]

interface LoadingScreenProps {
  onComplete?: () => void
}

function AnimatedCounter({ value }: { value: number }) {
  return (
    <div className="flex items-baseline gap-0.5 tabular-nums">
      {String(Math.round(value)).padStart(3, '0').split('').map((digit, i) => (
        <div key={i} className="relative w-[1ch] overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={`${i}-${digit}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="block text-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<'code' | 'counter' | 'greet' | 'exit'>('code')
  const [visibleLines, setVisibleLines] = useState(0)
  const [typingCol, setTypingCol] = useState(0)
  const [counter, setCounter] = useState(0)
  const [greetIndex, setGreetIndex] = useState(0)
  const codeRef = useRef<HTMLDivElement>(null)

  const shuffledGreetings = useMemo(() => {
    const arr = [...greetings]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return [...arr, "Welcome"]
  }, [])

  // Phase 1: Code typing
  useEffect(() => {
    if (phase !== 'code') return

    let lineIndex = 0
    let colIndex = 0

    const typeChar = () => {
      const currentLine = codeLines[lineIndex]
      const fullText = currentLine.tokens.map(t => t.text).join('')

      if (colIndex <= fullText.length) {
        setVisibleLines(lineIndex)
        setTypingCol(colIndex)
        colIndex++
        setTimeout(typeChar, 12 + Math.random() * 18)
      } else if (lineIndex < codeLines.length - 1) {
        lineIndex++
        colIndex = 0
        setVisibleLines(lineIndex)
        setTypingCol(0)
        setTimeout(typeChar, 60)
      } else {
        // Code done — move to counter
        setTimeout(() => setPhase('counter'), 400)
      }
    }

    setTimeout(typeChar, 500)
  }, [phase])

  // Phase 2: Counter
  useEffect(() => {
    if (phase !== 'counter') return

    let start = 0
    const duration = 1200
    const startTime = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCounter(Math.round(eased * 100))

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setTimeout(() => setPhase('greet'), 300)
      }
    }

    requestAnimationFrame(tick)
  }, [phase])

  // Phase 3: Greetings
  useEffect(() => {
    if (phase !== 'greet') return

    const interval = setInterval(() => {
      setGreetIndex(prev => {
        if (prev >= shuffledGreetings.length - 1) {
          clearInterval(interval)
          setTimeout(() => {
            setPhase('exit')
            setTimeout(() => onComplete?.(), 1000)
          }, 500)
          return prev
        }
        return prev + 1
      })
    }, 220)

    return () => clearInterval(interval)
  }, [phase, shuffledGreetings, onComplete])

  // Render a line of code with syntax highlighting
  const renderCodeLine = (lineIndex: number) => {
    const line = codeLines[lineIndex]
    const fullText = line.tokens.map(t => t.text).join('')
    const isCurrentLine = lineIndex === visibleLines
    const displayLength = isCurrentLine ? typingCol : (lineIndex < visibleLines ? fullText.length : 0)

    if (lineIndex > visibleLines) return null

    let charCount = 0
    return (
      <div className="flex items-center group" key={lineIndex}>
        {/* Line number */}
        <span className="w-8 text-right mr-4 text-[11px] text-white/[0.12] select-none font-mono">
          {lineIndex + 1}
        </span>
        {/* Code content */}
        <span className="font-mono text-[13px] leading-relaxed">
          {line.tokens.map((token, ti) => {
            const tokenStart = charCount
            const tokenEnd = charCount + token.text.length
            charCount = tokenEnd

            if (tokenStart >= displayLength) return null

            const visibleText = token.text.slice(0, Math.max(0, displayLength - tokenStart))
            return (
              <span key={ti} style={{ color: token.color }}>
                {visibleText}
              </span>
            )
          })}
          {/* Blinking cursor on current line */}
          {isCurrentLine && (
            <motion.span
              className="inline-block w-[2px] h-[15px] ml-px -mb-[2px] align-middle"
              style={{ backgroundColor: '#528bff' }}
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            />
          )}
        </span>
      </div>
    )
  }

  return (
    <AnimatePresence>
      {phase !== 'exit' ? (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[99999] flex items-center justify-center overflow-hidden"
          style={{ background: '#0a0a12' }}
        >
          {/* Subtle radial gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.04)_0%,transparent_70%)]" />

          {/* Floating code characters in background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
            {['</', '/>', '{', '}', '()', '=>', '[]', '&&', '||', '==='].map((char, i) => (
              <motion.span
                key={i}
                className="absolute text-white/[0.03] font-mono text-lg"
                style={{
                  left: `${10 + (i * 9) % 80}%`,
                  top: `${5 + (i * 13) % 90}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 6 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
              >
                {char}
              </motion.span>
            ))}
          </div>

          {/* Corner lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <motion.line x1="0" y1="0" x2="80" y2="0" stroke="rgba(139,92,246,0.15)" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.line x1="0" y1="0" x2="0" y2="80" stroke="rgba(139,92,246,0.15)" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.line x1="100%" y1="100%" x2="calc(100% - 80px)" y2="100%" stroke="rgba(139,92,246,0.15)" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
            <motion.line x1="100%" y1="100%" x2="100%" y2="calc(100% - 80px)" stroke="rgba(139,92,246,0.15)" strokeWidth="1"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          </svg>

          <div className="relative z-10 w-full max-w-2xl px-6">
            <AnimatePresence mode="wait">
              {/* PHASE 1: Code Editor */}
              {phase === 'code' && (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                  transition={{ exit: { duration: 0.3 } }}
                >
                  {/* Editor window */}
                  <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
                    style={{ background: 'rgba(15, 15, 25, 0.8)', backdropFilter: 'blur(20px)' }}
                  >
                    {/* Title bar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                        </div>
                        <span className="ml-3 text-[11px] font-mono text-white/20">portfolio.tsx</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-mono text-emerald-500/60">compiling</span>
                      </div>
                    </div>

                    {/* Code area */}
                    <div ref={codeRef} className="p-5 space-y-0.5 min-h-[280px] overflow-hidden">
                      {codeLines.map((_, i) => renderCodeLine(i))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PHASE 2: Counter */}
              {phase === 'counter' && (
                <motion.div
                  key="counter"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2, filter: 'blur(12px)' }}
                  transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                >
                  {/* Big percentage */}
                  <div className="relative">
                    {/* Glow behind */}
                    <div className="absolute inset-0 blur-[60px] bg-violet-500/20 rounded-full scale-150" />
                    <div className="relative text-8xl md:text-[10rem] font-black tracking-tighter"
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #8b5cf6 50%, #ec4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      <AnimatedCounter value={counter} />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-6 w-48 h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
                      animate={{ width: `${counter}%` }}
                      transition={{ duration: 0.05 }}
                    />
                  </div>

                  <motion.p
                    className="mt-4 text-xs font-mono text-white/20 tracking-[0.3em] uppercase"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Building experience
                  </motion.p>
                </motion.div>
              )}

              {/* PHASE 3: Greetings */}
              {phase === 'greet' && (
                <motion.div
                  key="greet"
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="relative h-28 flex items-center justify-center" style={{ perspective: '800px' }}>
                    <AnimatePresence mode="wait">
                      <motion.h1
                        key={greetIndex}
                        initial={{ opacity: 0, y: 50, rotateX: -60, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -50, rotateX: 60, filter: 'blur(10px)' }}
                        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute text-6xl md:text-8xl font-black tracking-tight"
                        style={{
                          background: greetIndex === shuffledGreetings.length - 1
                            ? 'linear-gradient(135deg, #c084fc, #f472b6, #818cf8)'
                            : 'linear-gradient(135deg, #ffffff 30%, #6b7280)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {shuffledGreetings[greetIndex]}
                      </motion.h1>
                    </AnimatePresence>
                  </div>

                  {/* Dot progress */}
                  <div className="flex gap-1.5 mt-4">
                    {shuffledGreetings.map((_, i) => (
                      <motion.div
                        key={i}
                        className="rounded-full"
                        animate={{
                          width: i === greetIndex ? 18 : 4,
                          height: 4,
                          backgroundColor: i <= greetIndex
                            ? i === greetIndex ? '#8b5cf6' : 'rgba(139,92,246,0.2)'
                            : 'rgba(255,255,255,0.05)',
                        }}
                        transition={{ duration: 0.15 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom status */}
          <div className="absolute bottom-5 left-0 right-0 flex justify-center">
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/[0.12] tracking-wider">
              <span>ANIRUDDHA PATIL</span>
              <span className="w-px h-3 bg-white/[0.06]" />
              <span>PORTFOLIO v2.0</span>
            </div>
          </div>

          {/* Exit: Dual curtain split */}
          {phase === 'exit' && null}
        </motion.div>
      ) : (
        /* EXIT ANIMATION: Split curtain */
        <>
          <motion.div
            key="curtain-top"
            className="fixed top-0 left-0 right-0 h-1/2 z-[99999]"
            style={{ background: '#0a0a12' }}
            initial={{ y: 0 }}
            animate={{ y: '-100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
          <motion.div
            key="curtain-bottom"
            className="fixed bottom-0 left-0 right-0 h-1/2 z-[99999]"
            style={{ background: '#0a0a12' }}
            initial={{ y: 0 }}
            animate={{ y: '100%' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      )}
    </AnimatePresence>
  )
}
