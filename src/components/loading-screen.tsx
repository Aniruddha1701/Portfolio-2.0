"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { CodeXml } from "lucide-react"

const words = ["Hello", "नमस्ते", "Bonjour", "Ciao", "Olá", "Guten Tag", "Welcome"];

export function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 400); // Should be faster than the total animation time to feel fluid

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
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background"
    >
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
