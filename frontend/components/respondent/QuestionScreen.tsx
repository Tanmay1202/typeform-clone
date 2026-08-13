'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './respondent.module.css';
import { Star } from 'lucide-react';

interface QuestionScreenProps {
  question: any;
  value: string;
  onChange: (val: string) => void;
  onNext: () => void;
  error?: string;
}

export default function QuestionScreen({ question, value, onChange, onNext, error }: QuestionScreenProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Auto-focus the input when the question renders
    if (inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300); // Wait for transition
    }
  }, [question.id]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onNext();
    }
  };

  return (
    <div className={styles.questionContainer}>
      <h2 className={styles.questionTitle}>
        <span className={styles.questionNumber}>{question.order_index + 1}</span>
        {question.title}
        {question.required && <span className={styles.requiredAsterisk}>*</span>}
      </h2>
      
      {question.description && (
        <p className={styles.questionDescription}>{question.description}</p>
      )}

      <div className={styles.inputWrapper}>
        {question.type === 'SHORT_TEXT' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            className={styles.textInput}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
          />
        )}

        {question.type === 'LONG_TEXT' && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={styles.textArea}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer here..."
            rows={3}
          />
        )}
        
        {question.type === 'EMAIL' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="email"
            className={styles.textInput}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="name@example.com"
          />
        )}

        {question.type === 'NUMBER' && (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="number"
            className={styles.textInput}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="0"
          />
        )}

        {question.type === 'MULTIPLE_CHOICE' && (
          <div className={styles.optionsList}>
            {question.options?.map((opt: any, idx: number) => {
              const letter = String.fromCharCode(65 + idx); // A, B, C...
              const isSelected = value === opt.label;
              return (
                <div 
                  key={opt.id}
                  className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => {
                    onChange(opt.label);
                    // Slight delay before auto-advancing for UX
                    setTimeout(onNext, 400); 
                  }}
                >
                  <span className={styles.optionLetter}>{letter}</span>
                  {opt.label}
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'DROPDOWN' && (
          <select
            className={styles.selectInput}
            value={value || ''}
            onChange={(e) => {
              onChange(e.target.value);
              setTimeout(onNext, 400);
            }}
          >
            <option value="" disabled>Select an option...</option>
            {question.options?.map((opt: any) => (
              <option key={opt.id} value={opt.label}>{opt.label}</option>
            ))}
          </select>
        )}

        {question.type === 'YES_NO' && (
          <div className={styles.optionsList}>
            {['Yes', 'No'].map((opt, idx) => {
              const letter = opt === 'Yes' ? 'Y' : 'N';
              const isSelected = value === opt;
              return (
                <div 
                  key={opt}
                  className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                  onClick={() => {
                    onChange(opt);
                    setTimeout(onNext, 400); 
                  }}
                >
                  <span className={styles.optionLetter}>{letter}</span>
                  {opt}
                </div>
              );
            })}
          </div>
        )}

        {question.type === 'RATING' && (
          <div className={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => {
              const currentRating = parseInt(value || '0');
              const isFilled = star <= currentRating;
              return (
                <Star
                  key={star}
                  size={48}
                  strokeWidth={1}
                  className={`${styles.starIcon} ${isFilled ? styles.starIconFilled : ''}`}
                  onClick={() => {
                    onChange(star.toString());
                    setTimeout(onNext, 400);
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.actionRow}>
        {['SHORT_TEXT', 'LONG_TEXT', 'EMAIL', 'NUMBER'].includes(question.type) && (
          <button className={styles.okButton} onClick={onNext}>
            OK <span className={styles.enterHint}>press Enter ↵</span>
          </button>
        )}
      </div>
    </div>
  );
}
