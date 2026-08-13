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
  onAdd: () => void;
}

function SortableItem({ question, isActive, onSelect, index }: { question: Question, isActive: boolean, onSelect: () => void, index: number }) {
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

  const colors = [styles.badgeBlue, styles.badgeGreen, styles.badgeYellow, styles.badgePurple];
  const badgeClass = colors[index % colors.length];

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
        <span className={clsx(styles.iconBox, badgeClass)}>{index + 1}</span>
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
              {questions.map((q, i) => (
                <SortableItem
                  key={q.id}
                  question={q}
                  index={i}
                  isActive={q.id === activeId}
                  onSelect={() => onSelect(q.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <div className={styles.endingsSection}>
        <div className={styles.endingsHeader}>
          Endings
          <Plus size={16} className={styles.endingsPlus} onClick={() => alert("Custom Endings coming soon!")} />
        </div>
      </div>
    </div>
  );
}
