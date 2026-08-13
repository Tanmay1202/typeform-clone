'use client';

import React from 'react';
import styles from './picker.module.css';
import { 
  Type, 
  AlignLeft, 
  List, 
  ChevronDownSquare, 
  Mail, 
  Hash, 
  ToggleLeft, 
  Star,
  X
} from 'lucide-react';

interface QuestionTypePickerProps {
  onClose: () => void;
  onSelect: (type: string) => void;
}

const QUESTION_TYPES = [
  { id: 'SHORT_TEXT', label: 'Short Text', icon: Type, category: 'Text', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'LONG_TEXT', label: 'Long Text', icon: AlignLeft, category: 'Text', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: List, category: 'Choice', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'DROPDOWN', label: 'Dropdown', icon: ChevronDownSquare, category: 'Choice', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'YES_NO', label: 'Yes/No', icon: ToggleLeft, category: 'Choice', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'EMAIL', label: 'Email', icon: Mail, category: 'Contact info', color: '#ec4899', bg: '#fdf2f8' },
  { id: 'NUMBER', label: 'Number', icon: Hash, category: 'Other', color: '#eab308', bg: '#fefce8' },
  { id: 'RATING', label: 'Rating', icon: Star, category: 'Rating & ranking', color: '#22c55e', bg: '#f0fdf4' },
];

export default function QuestionTypePicker({ onClose, onSelect }: QuestionTypePickerProps) {
  // Group by category
  const categories = QUESTION_TYPES.reduce((acc, curr) => {
    if (!acc[curr.category]) acc[curr.category] = [];
    acc[curr.category].push(curr);
    return acc;
  }, {} as Record<string, typeof QUESTION_TYPES>);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.tabs}>
            <div className={`${styles.tab} ${styles.activeTab}`}>Add form elements</div>
          </div>
          <button className={styles.closeButton} onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.sidebar}>
            <input type="text" placeholder="Search form elements" className={styles.searchInput} />
          </div>
          
          <div className={styles.mainGrid}>
            {Object.entries(categories).map(([category, items]) => (
              <div key={category} className={styles.categoryBlock}>
                <h3 className={styles.categoryTitle}>{category}</h3>
                <div className={styles.itemsList}>
                  {items.map(item => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={item.id} 
                        className={styles.itemCard}
                        onClick={() => onSelect(item.id)}
                      >
                        <div className={styles.itemIconWrapper} style={{ backgroundColor: item.bg, color: item.color }}>
                          <Icon size={16} />
                        </div>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
