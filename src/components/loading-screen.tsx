"use client"

import { motion } from "framer-motion"
import { CodeXml } from "lucide-react"

export function LoadingScreen() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      } 
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        repeat: Infinity,
        repeatType: "mirror",
        duration: 1.5,
      },
    },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background"
    >
      <motion.div variants={iconVariants}>
        <CodeXml className="h-20 w-20 text-primary" />
      </motion.div>
      <motion.p 
        variants={textVariants}
        className="mt-6 text-lg text-muted-foreground font-code"
      >
        Compiling creativity...
      </motion.p>
    </motion.div>
  )
}
