'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ThankYouScreen({ message }: { message?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      padding: '20px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ fontSize: '32px', marginBottom: '16px', color: 'var(--text-primary)' }}>
          {message || 'Thank you!'}
        </h1>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)' }}>
          Your response has been recorded.
        </p>
      </motion.div>
    </div>
  );
}
