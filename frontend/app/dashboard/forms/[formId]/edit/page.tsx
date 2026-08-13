'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getForm, updateForm, reorderQuestions, createQuestion, updateQuestion, deleteQuestion } from '../../../../../lib/api';
import DragDropList from '../../../../../components/builder/DragDropList';
import LivePreviewPane from '../../../../../components/builder/LivePreviewPane';
import QuestionEditor from '../../../../../components/builder/QuestionEditor';
import FormSettingsPanel from '../../../../../components/builder/FormSettingsPanel';
import QuestionTypePicker from '../../../../../components/builder/QuestionTypePicker';
import ResultsView from '../../../../../components/builder/ResultsView';
import styles from './edit.module.css';
import dashboardStyles from '../../../dashboard.module.css'; // For modal styles
import { ChevronRight, Play, Eye, Share, Plus, Smartphone, Monitor, Settings } from 'lucide-react';
import Link from 'next/link';

type ModalConfig = {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export default function BuilderPage() {
  const params = useParams();
  const formId = parseInt(params.formId as string, 10);

  const [form, setForm] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'create' | 'results'>('create');
  const [modal, setModal] = useState<ModalConfig>({ isOpen: false, type: 'alert', title: '' });

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
    setIsPickerOpen(false);
    const newQ = await createQuestion(formId, {
      type,
      title: 'New Question',
      required: false,
      order_index: questions.length
    });
    setQuestions([...questions, newQ]);
    setActiveQuestionId(newQ.id);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const updated = await updateForm(formId, { status: 'PUBLISHED' });
      setForm(updated);
      setModal({
        isOpen: true,
        type: 'alert',
        title: 'Form published!',
        message: `Your form is live at:\n${window.location.origin}/f/${updated.share_slug}`,
        onConfirm: () => setModal({ isOpen: false, type: 'alert', title: '' })
      });
    } catch (err) {
      console.error(err);
      setModal({
        isOpen: true,
        type: 'alert',
        title: 'Publish Failed',
        message: 'There was an error publishing your form.',
        onConfirm: () => setModal({ isOpen: false, type: 'alert', title: '' })
      });
    }
    setIsPublishing(false);
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
    <div className={styles.layout}>
      {/* Top Navigation */}
      <header className={styles.topNav}>
        <div className={styles.navLeft}>
          <Link href="/dashboard" className={styles.navBreadcrumb}>Forms</Link>
          <ChevronRight size={16} color="#9ca3af" />
          <span className={styles.navBreadcrumbCurrent}>{form?.title || 'New form'}</span>
        </div>
        
        <div className={styles.navCenter}>
          <div 
            className={`${styles.navTab} ${activeTab === 'create' ? styles.navTabActive : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create
          </div>
          <div 
            className={`${styles.navTab} ${activeTab === 'results' ? styles.navTabActive : ''}`}
            onClick={() => setActiveTab('results')}
          >
            Results
          </div>
        </div>

        <div className={styles.navRight}>
          <button 
            className={`${styles.publishButton} ${isPublishing ? styles.publishButtonDisabled : ''}`}
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <Play size={16} fill="white" /> 
            {form.status === 'PUBLISHED' ? 'Update' : 'Publish'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {activeTab === 'create' ? (
        <div className={styles.container}>
          <aside className={styles.sidebarLeft}>
            <div className={styles.header}>
              Pages
            </div>
            <DragDropList 
              questions={questions} 
              onReorder={handleReorder} 
              activeId={activeQuestionId}
              onSelect={setActiveQuestionId}
              onAdd={() => setIsPickerOpen(true)}
            />
          </aside>

          <main className={styles.mainPreview}>
            <div className={styles.canvasToolbar}>
              <button className={styles.addContentBtn} onClick={() => setIsPickerOpen(true)}>
                <Plus size={16} /> Add content
              </button>
              <div style={{ flex: 1 }} />
            </div>
            <div className={styles.canvasPreviewCard}>
              <LivePreviewPane question={activeQuestion} />
            </div>
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
              <FormSettingsPanel form={form} onUpdate={(data) => updateForm(formId, data).then(setForm)} />
            )}
          </aside>
        </div>
      ) : (
        <ResultsView form={form} />
      )}

      {isPickerOpen && (
        <QuestionTypePicker 
          onClose={() => setIsPickerOpen(false)} 
          onSelect={handleAddQuestion} 
        />
      )}

      {/* Custom Modal */}
      {modal.isOpen && (
        <div className={dashboardStyles.modalOverlay} onClick={modal.onCancel}>
          <div className={dashboardStyles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={dashboardStyles.modalTitle}>{modal.title}</h2>
            {modal.message && (
              <p className={dashboardStyles.modalMessage} style={{ whiteSpace: 'pre-line' }}>
                {modal.message}
              </p>
            )}
            
            <div className={dashboardStyles.modalActions}>
              {modal.type !== 'alert' && (
                <button className={dashboardStyles.modalCancelBtn} onClick={modal.onCancel}>Cancel</button>
              )}
              <button 
                className={dashboardStyles.modalConfirmBtn} 
                onClick={modal.onConfirm}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
