'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPublicForm, submitResponse } from '../../../lib/api';
import TransitionWrapper from '../../../components/respondent/TransitionWrapper';
import QuestionScreen from '../../../components/respondent/QuestionScreen';
import ProgressBar from '../../../components/respondent/ProgressBar';
import ThankYouScreen from '../../../components/respondent/ThankYouScreen';

export default function RespondentFlow() {
  const params = useParams();
  const shareSlug = params.shareSlug as string;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [validationError, setValidationError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    getPublicForm(shareSlug)
      .then(data => {
        setForm(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Form not found or is no longer accepting responses.');
        setLoading(false);
      });
  }, [shareSlug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' && currentIndex > 0 && !isSubmitted) {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isSubmitted]);

  const handleNext = () => {
    if (!form) return;
    const currentQ = form.questions[currentIndex];
    const val = answers[currentQ.id];

    // Client-side validation
    if (currentQ.required && (!val || val.trim() === '')) {
      setValidationError('This question is required.');
      return;
    }

    if (currentQ.type === 'EMAIL' && val && !/^\S+@\S+\.\S+$/.test(val)) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (currentQ.type === 'NUMBER' && val && isNaN(Number(val))) {
      setValidationError('Please enter a valid number.');
      return;
    }

    setValidationError('');
    setDirection(1);

    if (currentIndex < form.questions.length - 1) {
      setCurrentIndex(curr => curr + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setValidationError('');
    setDirection(-1);
    setCurrentIndex(curr => curr - 1);
  };

  const handleSubmit = async () => {
    try {
      const answersList = Object.entries(answers).map(([qId, val]) => ({
        question_id: parseInt(qId),
        value: val
      }));

      await submitResponse(shareSlug, {
        completed: true,
        answers: answersList
      });
      setIsSubmitted(true);
    } catch (err) {
      setValidationError('Failed to submit response. Please try again.');
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  if (error) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red' }}>{error}</div>;
  if (!form || !form.questions || form.questions.length === 0) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>This form has no questions.</div>;

  if (isSubmitted) {
    return <ThankYouScreen message={form.thank_you_message} />;
  }

  const currentQuestion = form.questions[currentIndex];
  const progress = (currentIndex / form.questions.length) * 100;

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--surface)', overflow: 'hidden' }}>
      <ProgressBar progress={progress} />
      
      <TransitionWrapper direction={direction} stepKey={currentQuestion.id}>
        <QuestionScreen 
          question={currentQuestion}
          value={answers[currentQuestion.id] || ''}
          onChange={(val) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }))}
          onNext={handleNext}
          error={validationError}
        />
      </TransitionWrapper>
    </div>
  );
}
