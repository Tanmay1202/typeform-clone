'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';
import clsx from 'clsx';
import styles from './builder.module.css';

interface Question {
  id: number;
  type: string;
  title: string;
  order_index: number;
}

interface DragDropListProps {
  questions: Question[];
  onReorder: (newQuestions: Question[]) => void;
  activeId: number | null;
  onSelect: (id: number) => void;
  onAdd: (type: string) => void;
}

function SortableItem({ question, isActive, onSelect }: { question: Question, isActive: boolean, onSelect: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(styles.questionListItem, isActive && styles.questionListActive)}
      onClick={onSelect}
    >
      <div className={styles.dragHandle} {...attributes} {...listeners}>
        <GripVertical size={16} color="#aaa" />
      </div>
      <div className={styles.questionIcon}>
        {/* Placeholder for question type icon */}
        <span className={styles.iconBox}>{question.type.charAt(0)}</span>
      </div>
      <div className={styles.questionTitle}>
        {question.title || '...'}
      </div>
    </div>
  );
}

export default function DragDropList({ questions, onReorder, activeId, onSelect, onAdd }: DragDropListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);

      const newQuestions = arrayMove(questions, oldIndex, newIndex).map((q, index) => ({
        ...q,
        order_index: index,
      }));
      onReorder(newQuestions);
    }
  }

  return (
    <div className={styles.sidebarContent}>
      <div className={styles.listSection}>
        <div className={styles.sectionTitle}>Pages</div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map(q => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className={styles.questionList}>
              {questions.map((q) => (
                <SortableItem
                  key={q.id}
                  question={q}
                  isActive={q.id === activeId}
                  onSelect={() => onSelect(q.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      
      <div className={styles.addButtonWrapper}>
        <button 
          className={styles.addContentButton}
          onClick={() => onAdd('SHORT_TEXT')}
        >
          <Plus size={16} />
          Add content
        </button>
      </div>
    </div>
  );
}
