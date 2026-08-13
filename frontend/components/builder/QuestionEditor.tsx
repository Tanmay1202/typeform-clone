'use client';

import React from 'react';
import styles from './builder.module.css';

interface QuestionEditorProps {
  question: any;
  onChange: (data: any) => void;
  onDelete: () => void;
}

export default function QuestionEditor({ question, onChange, onDelete }: QuestionEditorProps) {
  return (
    <div className={styles.editorPanel}>
      <div className={styles.editorSection}>
        <label>Question Type</label>
        <select 
          className={styles.editorSelect}
          value={question.type}
          onChange={(e) => onChange({ type: e.target.value })}
        >
          <option value="SHORT_TEXT">Short Text</option>
          <option value="LONG_TEXT">Long Text</option>
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="EMAIL">Email</option>
          <option value="NUMBER">Number</option>
        </select>
      </div>

      <div className={styles.editorSection}>
        <label>Title</label>
        <input 
          type="text" 
          className={styles.editorInput}
          value={question.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
        />
      </div>

      <div className={styles.editorSection}>
        <label>Description</label>
        <textarea 
          className={styles.editorTextarea}
          rows={3}
          value={question.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>

      <div className={styles.editorToggleRow}>
        <label>Required</label>
        <input 
          type="checkbox"
          checked={question.required || false}
          onChange={(e) => onChange({ required: e.target.checked })}
        />
      </div>

      <div className={styles.dangerZone}>
        <button className={styles.deleteButton} onClick={onDelete}>
          Delete Question
        </button>
      </div>
    </div>
  );
}
