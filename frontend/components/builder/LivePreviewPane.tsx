'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './builder.module.css';

interface LivePreviewPaneProps {
  question: any;
}

export default function LivePreviewPane({ question }: LivePreviewPaneProps) {
  if (!question) {
    return (
      <div className={styles.previewContainer}>
        <div style={{ color: '#aaa' }}>No question selected</div>
      </div>
    );
  }

  return (
    <div className={styles.previewContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.previewCard}
        >
          <h2 className={styles.previewTitle}>
            {question.title || 'Your question here'}
            {question.required && <span style={{ color: 'var(--accent-color)' }}> *</span>}
          </h2>
          
          {question.description && (
            <p className={styles.previewDescription}>{question.description}</p>
          )}

          {question.type === 'SHORT_TEXT' && (
            <input 
              type="text" 
              className={styles.previewInput} 
              placeholder="Type your answer here..."
              readOnly
            />
          )}

          {question.type === 'LONG_TEXT' && (
            <textarea 
              className={styles.previewInput} 
              placeholder="Type your answer here..."
              rows={3}
              readOnly
              style={{ resize: 'none' }}
            />
          )}

          {question.type === 'MULTIPLE_CHOICE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ 
                  padding: '12px 16px', 
                  border: '1px solid var(--accent-color)', 
                  borderRadius: 6,
                  color: 'var(--accent-color)',
                  backgroundColor: 'rgba(4, 69, 175, 0.05)',
                  cursor: 'pointer'
                }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: 24, height: 24, 
                    border: '1px solid var(--accent-color)', 
                    marginRight: 12,
                    borderRadius: 4,
                    fontSize: 12
                  }}>{String.fromCharCode(64 + i)}</span>
                  Option {i}
                </div>
              ))}
            </div>
          )}

          {['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER'].includes(question.type) && (
            <div style={{ marginTop: 24 }}>
              <button className={styles.previewButton}>OK</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
