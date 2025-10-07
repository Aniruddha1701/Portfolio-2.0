"use client"

import { motion } from "framer-motion";
import { Settings, Lock, Shield } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function AdminButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: 1,
        type: "spring",
        stiffness: 200,
        damping: 20
      }}
    >
      <Link href="/admin/login">
        <motion.button
          className="relative group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
          
          {/* Main button */}
          <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
            <motion.div
              animate={{ rotate: isHovered ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Settings className="w-6 h-6 text-white" />
            </motion.div>
            
            {/* Pulse effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary/30 opacity-75 animate-ping"></span>
          </div>
          
          {/* Tooltip */}
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black/90 text-white text-sm rounded-lg whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              y: isHovered ? 0 : 10
            }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </div>
            <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-2 h-2 bg-black/90"></div>
          </motion.div>
        </motion.button>
      </Link>
    </motion.div>
  );
}
