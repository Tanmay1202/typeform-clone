'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      backgroundColor: 'rgba(0,0,0,0.05)',
      zIndex: 50
    }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          height: '100%',
          backgroundColor: 'var(--accent-color)'
        }}
      />
    </div>
  );
}
