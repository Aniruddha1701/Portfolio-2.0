"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const words = ["Hello", "नमस्ते", "Bonjour", "Ciao", "Olá", "こんにちは", "Hola", "Welcome"];

interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 4000; // 4 seconds total (500ms per word) - much slower and clearer
    const intervalTime = totalDuration / words.length;

    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev === words.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete?.();
          }, 800); // Linger longer on the final "Welcome"
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    // Sync progress with index
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 10)); // clear smoothly
      });
    }, 10);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  // Use calculated progress based on index for smoother visual if preferred, 
  // but linear progress is fine too. Let's stick to the linear progress above but ensure it hits 100.

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, when: "beforeChildren" }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  const textVariants = {
    enter: {
      opacity: 0,
      y: 20,
      filter: "blur(10px)",
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
      y: -20,
      filter: "blur(10px)",
      transition: { duration: 0.2 }
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Animated gradient mesh background - darker and more subtle */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Text container */}
        <div className="relative flex items-center justify-center h-40 md:h-60 w-full z-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25 }}
              className="absolute text-5xl md:text-7xl font-bold leading-relaxed py-4"
              style={{
                background: 'linear-gradient(to right, #fff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {words[index]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Loading progress bar */}
        <div className="mt-12 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
            initial={{ width: 0 }}
            animate={{ width: `${(index + 1) * (100 / words.length)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
      </div>
    </motion.div>
  )
}

