"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const words = ["Hello", "नमस्ते", "Bonjour", "Ciao", "Olá", "Guten Tag", "Welcome"];

const shapes = [
  {
    Component: (props: any) => (
      <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20,50 C 20,20 80,20 80,50 S 20,80 20,50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>
    ),
    style: { top: "15%", left: "10%", width: "80px", height: "80px", rotate: -15 },
    animate: { scale: [1, 1.1, 1], y: [-10, 10, -10] },
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  },
  {
    Component: (props: any) => (
      <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" rx="10" fill="none" stroke="currentColor" strokeWidth="4"/>
      </svg>
    ),
    style: { top: "20%", right: "15%", width: "60px", height: "60px" },
    animate: { rotate: [0, 360] },
    transition: { duration: 12, repeat: Infinity, ease: "linear" }
  },
  {
    Component: (props: any) => (
      <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
         <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="4" />
         <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="4" />
      </svg>
    ),
    style: { bottom: "10%", left: "20%", width: "50px", height: "50px" },
    animate: { y: [0, -20, 0], x: [0, 10, 0] },
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
  },
  {
      Component: (props: any) => (
          <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 50 L50 10 L90 50 L50 90 Z" fill="none" stroke="currentColor" strokeWidth="4"/>
          </svg>
      ),
      style: { bottom: "25%", right: "20%", width: "70px", height: "70px" },
      animate: { scale: [1, 1.2, 1], rotate: [0, -90, 0] },
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
  },
    {
      Component: (props: any) => (
        <svg {...props} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="10 10"/>
        </svg>
      ),
      style: { top: "50%", left: "30%", width: "40px", height: "40px" },
      animate: { rotate: 360 },
      transition: { duration: 15, repeat: Infinity, ease: "linear" }
  },
];


export function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 400); 

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5, when: "beforeChildren" } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" }
    }
  };

  const textVariants = {
    enter: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    center: {
      zIndex: 1,
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    },
    exit: {
      zIndex: 0,
      opacity: 0,
      filter: "blur(8px)",
      transition: { duration: 0.4 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        {shapes.map((shape, i) => (
            <motion.div
                key={i}
                className="absolute text-primary/30"
                style={shape.style}
                animate={shape.animate}
                transition={shape.transition}
            >
                <shape.Component />
            </motion.div>
        ))}
      </div>

      <div className="relative flex items-center justify-center h-24 w-60">
        <AnimatePresence>
            <motion.p
              key={index}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                y: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 },
                filter: {duration: 0.5}
              }}
              className="absolute text-3xl font-bold font-headline text-primary"
            >
              {words[index]}
            </motion.p>
        </AnimatePresence>
      </div>

    </motion.div>
  )
}
