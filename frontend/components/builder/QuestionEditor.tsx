'use client';

import React, { useState } from 'react';
import styles from './builder.module.css';
import { Trash2, Type, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface QuestionEditorProps {
  question: any;
  onChange: (data: any) => void;
  onDelete: () => void;
}

export default function QuestionEditor({ question, onChange, onDelete }: QuestionEditorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'design'>('content');

  const questionTypeMap: Record<string, string> = {
    SHORT_TEXT: 'Short Text',
    LONG_TEXT: 'Long Text',
    MULTIPLE_CHOICE: 'Multiple Choice',
    DROPDOWN: 'Dropdown',
    YES_NO: 'Yes/No',
    EMAIL: 'Email',
    NUMBER: 'Number',
    RATING: 'Rating',
  };

  const handleOptionChange = (idx: number, newLabel: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[idx] = { ...newOptions[idx], label: newLabel, order_index: idx };
    onChange({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOptions = [...(question.options || [])];
    newOptions.push({ label: `Option ${newOptions.length + 1}`, order_index: newOptions.length });
    onChange({ options: newOptions });
  };

  const handleRemoveOption = (idx: number) => {
    const newOptions = [...(question.options || [])];
    newOptions.splice(idx, 1);
    newOptions.forEach((opt, i) => opt.order_index = i);
    onChange({ options: newOptions });
  };

  const showOptions = question.type === 'MULTIPLE_CHOICE' || question.type === 'DROPDOWN';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className={styles.rightSidebarTabs}>
        <div 
          className={clsx(styles.rightSidebarTab, activeTab === 'content' && styles.rightSidebarTabActive)}
          onClick={() => setActiveTab('content')}
        >
          Content
        </div>
        <div 
          className={clsx(styles.rightSidebarTab, activeTab === 'design' && styles.rightSidebarTabActive)}
          onClick={() => setActiveTab('design')}
        >
          Design
        </div>
      </div>

      <div className={styles.editorPanel}>
        {activeTab === 'content' ? (
          <>
            <div className={styles.editorSection}>
              <label>Question Type</label>
              <div className={styles.fancySelectWrapper}>
                <Type size={16} color="#aaa" style={{ marginRight: 8 }} />
                <span style={{ flex: 1, fontSize: 14 }}>{questionTypeMap[question.type] || 'Select type'}</span>
                <ChevronDown size={16} color="#aaa" />
                <select 
                  className={styles.fancySelect}
                  value={question.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    const updates: any = { type: newType };
                    // If switching to a choice type, ensure they have at least 1 option
                    if (['MULTIPLE_CHOICE', 'DROPDOWN'].includes(newType) && (!question.options || question.options.length === 0)) {
                      updates.options = [
                        { label: 'Option 1', order_index: 0 },
                        { label: 'Option 2', order_index: 1 }
                      ];
                    }
                    onChange(updates);
                  }}
                >
                  <option value="SHORT_TEXT">Short Text</option>
                  <option value="LONG_TEXT">Long Text</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="DROPDOWN">Dropdown</option>
                  <option value="YES_NO">Yes/No</option>
                  <option value="EMAIL">Email</option>
                  <option value="NUMBER">Number</option>
                  <option value="RATING">Rating</option>
                </select>
              </div>
            </div>

            <div className={styles.editorSection} style={{ marginTop: 16 }}>
              <label>Settings</label>
              
              <div className={styles.editorToggleRow} style={{ marginTop: 8 }}>
                <label>Required</label>
                <div 
                  className={clsx(styles.toggleSwitch, question.required && styles.toggleSwitchChecked)}
                  onClick={() => onChange({ required: !question.required })}
                >
                  <div className={styles.toggleKnob} />
                </div>
              </div>
            </div>

            <div className={styles.editorSection} style={{ marginTop: 16 }}>
              <label>Title</label>
              <input 
                type="text" 
                className={styles.editorInput}
                value={question.title || ''}
                onChange={(e) => onChange({ title: e.target.value })}
              />
            </div>

            <div className={styles.editorSection}>
              <label>Description (optional)</label>
              <textarea 
                className={styles.editorTextarea}
                rows={3}
                value={question.description || ''}
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </div>

            {showOptions && (
              <div className={styles.editorSection} style={{ marginTop: 16 }}>
                <label>Choices</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                  {(question.options || []).map((opt: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input 
                        type="text"
                        className={styles.editorInput}
                        value={opt.label}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                      />
                      <button 
                        onClick={() => handleRemoveOption(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 4 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={handleAddOption}
                    style={{ 
                      alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--accent-color)', 
                      fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '4px 0', marginTop: 4 
                    }}
                  >
                    + Add choice
                  </button>
                </div>
              </div>
            )}

            <div className={styles.dangerZone}>
              <button className={styles.deleteButton} onClick={onDelete}>
                <Trash2 size={16} /> Delete Question
              </button>
            </div>
          </>
        ) : (
          <div style={{ color: '#6b7280', fontSize: 14, textAlign: 'center', marginTop: 40 }}>
            Theme Design coming soon!
          </div>
        )}
      </div>
    </div>
  );
}
