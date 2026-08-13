'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getForm, updateForm, reorderQuestions, createQuestion, updateQuestion, deleteQuestion } from '../../../../../lib/api';
import DragDropList from '../../../../../components/builder/DragDropList';
import LivePreviewPane from '../../../../../components/builder/LivePreviewPane';
import QuestionEditor from '../../../../../components/builder/QuestionEditor';
import styles from './edit.module.css';

export default function BuilderPage() {
  const params = useParams();
  const formId = parseInt(params.formId as string, 10);

  const [form, setForm] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      getForm(formId).then(data => {
        setForm(data);
        setQuestions(data.questions || []);
        if (data.questions && data.questions.length > 0) {
          setActiveQuestionId(data.questions[0].id);
        }
        setLoading(false);
      });
    }
  }, [formId]);

  const handleReorder = async (newQuestions: any[]) => {
    setQuestions(newQuestions);
    const questionIds = newQuestions.map(q => q.id);
    await reorderQuestions(formId, questionIds);
  };

  const handleAddQuestion = async (type: string) => {
    const newQ = await createQuestion(formId, {
      type,
      title: 'New Question',
      required: false,
      order_index: questions.length
    });
    setQuestions([...questions, newQ]);
    setActiveQuestionId(newQ.id);
  };

  const handleUpdateQuestion = async (qId: number, data: any) => {
    const updated = await updateQuestion(formId, qId, data);
    setQuestions(questions.map(q => q.id === qId ? updated : q));
  };

  const handleDeleteQuestion = async (qId: number) => {
    await deleteQuestion(formId, qId);
    const newQs = questions.filter(q => q.id !== qId);
    setQuestions(newQs);
    if (activeQuestionId === qId) {
      setActiveQuestionId(newQs.length > 0 ? newQs[0].id : null);
    }
  };

  if (loading) return <div>Loading...</div>;

  const activeQuestion = questions.find(q => q.id === activeQuestionId);

  return (
    <div className={styles.container}>
      <aside className={styles.sidebarLeft}>
        <div className={styles.header}>
          Content
        </div>
        <DragDropList 
          questions={questions} 
          onReorder={handleReorder} 
          activeId={activeQuestionId}
          onSelect={setActiveQuestionId}
          onAdd={handleAddQuestion}
        />
      </aside>

      <main className={styles.mainPreview}>
        <LivePreviewPane question={activeQuestion} />
      </main>

      <aside className={styles.sidebarRight}>
        <div className={styles.header}>
          Settings
        </div>
        {activeQuestion ? (
          <QuestionEditor 
            question={activeQuestion} 
            onChange={(data) => handleUpdateQuestion(activeQuestion.id, data)} 
            onDelete={() => handleDeleteQuestion(activeQuestion.id)}
          />
        ) : (
          <div style={{ padding: 16 }}>Select a question</div>
        )}
      </aside>
    </div>
  );
}
