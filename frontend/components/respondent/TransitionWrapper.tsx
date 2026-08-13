'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransitionWrapperProps {
  children: React.ReactNode;
  direction: number; // 1 for forward, -1 for backward
  stepKey: string | number;
}

const variants = {
  enter: (direction: number) => {
    return {
      y: direction > 0 ? 50 : -50,
      opacity: 0
    };
  },
  center: {
    y: 0,
    opacity: 1
  },
  exit: (direction: number) => {
    return {
      y: direction < 0 ? 50 : -50,
      opacity: 0
    };
  }
};

export default function TransitionWrapper({ children, direction, stepKey }: TransitionWrapperProps) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={stepKey}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            y: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            maxWidth: '720px',
            padding: '20px'
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
