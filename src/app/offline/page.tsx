
"use client";

import { motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';

const OfflinePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 overflow-hidden">
      <div className="relative w-64 h-64" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          <div
            className="absolute w-64 h-64 flex items-center justify-center border-2 border-primary/20 bg-primary/10"
            style={{ transform: 'rotateY(0deg) translateZ(128px)' }}
          >
            <WifiOff className="w-24 h-24 text-primary opacity-50" />
          </div>
          <div
            className="absolute w-64 h-64 flex items-center justify-center border-2 border-primary/20 bg-primary/10"
            style={{ transform: 'rotateY(90deg) translateZ(128px)' }}
          >
             <WifiOff className="w-24 h-24 text-primary opacity-50" />
          </div>
          <div
            className="absolute w-64 h-64 flex items-center justify-center border-2 border-primary/20 bg-primary/10"
            style={{ transform: 'rotateY(180deg) translateZ(128px)' }}
          >
            <WifiOff className="w-24 h-24 text-primary opacity-50" />
          </div>
          <div
            className="absolute w-64 h-64 flex items-center justify-center border-2 border-primary/20 bg-primary/10"
            style={{ transform: 'rotateY(-90deg) translateZ(128px)' }}
          >
            <WifiOff className="w-24 h-24 text-primary opacity-50" />
          </div>
          <div
            className="absolute w-64 h-64 flex items-center justify-center border-2 border-primary/20 bg-primary/10"
            style={{ transform: 'rotateX(90deg) translateZ(128px)' }}
          >
             <WifiOff className="w-24 h-24 text-primary opacity-50" />
          </div>
          <div
            className="absolute w-64 h-64 flex items-center justify-center border-2 border-primary/20 bg-primary/10"
            style={{ transform: 'rotateX(-90deg) translateZ(128px)' }}
          >
             <WifiOff className="w-24 h-24 text-primary opacity-50" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-12"
      >
        <h1 className="text-4xl font-bold text-primary font-headline">Connection Lost</h1>
        <p className="text-muted-foreground mt-2">You appear to be offline.</p>
        <p className="text-muted-foreground">Please check your internet connection.</p>
      </motion.div>
    </div>
  );
};

export default OfflinePage;
