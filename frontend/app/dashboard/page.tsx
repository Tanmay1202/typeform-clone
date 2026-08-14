'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { fetchForms, createForm, updateForm, deleteForm, duplicateForm, fetchWorkspaces, createWorkspace } from '../../lib/api';
import styles from './dashboard.module.css';
import { Plus, Search, MoreHorizontal, Edit2, Trash2, Copy, LayoutGrid, List, ChevronDown, Calendar, PenLine, ArrowDownAZ } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ModalConfig = {
  isOpen: boolean;
  type: 'alert' | 'confirm' | 'prompt';
  title: string;
  message?: string;
  defaultValue?: string;
  onConfirm?: (val?: string) => void;
  onCancel?: () => void;
};

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<number | null>(null);
  
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'created' | 'updated' | 'alphabetical'>('created');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  
  const [modal, setModal] = useState<ModalConfig>({ isOpen: false, type: 'alert', title: '' });
  const modalInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    const initWorkspaces = async () => {
      try {
        const wsData = await fetchWorkspaces();
        if (isMounted) {
          setWorkspaces(wsData);
          if (wsData.length > 0 && !activeWorkspaceId) {
            setActiveWorkspaceId(wsData[0].id);
          } else {
            setLoading(false);
          }
        }
      } catch (e) {
        console.error(e);
        if (isMounted) setLoading(false);
      }
    };
    initWorkspaces();
    return () => { isMounted = false; };
  }, []); // Run once on mount

  useEffect(() => {
    let isMounted = true;
    if (!activeWorkspaceId) return;

    const loadForms = async () => {
      setLoading(true);
      try {
        const formData = await fetchForms(activeWorkspaceId);
        if (isMounted) setForms(formData);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadForms();
    return () => { isMounted = false; };
  }, [activeWorkspaceId]);

  useEffect(() => {
    if (modal.isOpen && modal.type === 'prompt' && modalInputRef.current) {
      modalInputRef.current.focus();
    }
  }, [modal.isOpen, modal.type]);

  const closeModal = () => setModal({ isOpen: false, type: 'alert', title: '' });

  const handleCreateWorkspace = async () => {
    setModal({
      isOpen: true,
      type: 'prompt',
      title: 'Create Workspace',
      message: 'Enter workspace name:',
      defaultValue: '',
      onConfirm: async (name) => {
        if (name) {
          const newWs = await createWorkspace({ name });
          setActiveWorkspaceId(newWs.id);
        }
        closeModal();
      },
      onCancel: closeModal
    });
  };

  const handleCreate = async () => {
    if (!activeWorkspaceId) {
      setModal({
        isOpen: true,
        type: 'alert',
        title: 'Workspace required',
        message: 'Please create or select a workspace first.',
        onConfirm: closeModal,
        onCancel: closeModal
      });
      return;
    }
    
    // 1-Click Create: Immediately create "New form" and redirect to edit page without a prompt
    const newForm = await createForm({ title: 'New form', workspace_id: activeWorkspaceId });
    router.push(`/dashboard/forms/${newForm.id}/edit`);
  };

  const handleRename = async (e: React.MouseEvent, form: any) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(null);
    setModal({
      isOpen: true,
      type: 'prompt',
      title: 'Rename Form',
      message: 'Enter new form title:',
      defaultValue: form.title,
      onConfirm: async (newTitle) => {
        if (newTitle && newTitle !== form.title) {
          await updateForm(form.id, { title: newTitle });
          if (activeWorkspaceId) {
            const formData = await fetchForms(activeWorkspaceId);
            setForms(formData);
          }
        }
        closeModal();
      },
      onCancel: closeModal
    });
  };

  const handleDelete = async (e: React.MouseEvent, formId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(null);
    setModal({
      isOpen: true,
      type: 'confirm',
      title: 'Delete Form',
      message: 'Are you sure you want to delete this form? This action cannot be undone.',
      onConfirm: async () => {
        await deleteForm(formId);
        if (activeWorkspaceId) {
          const formData = await fetchForms(activeWorkspaceId);
          setForms(formData);
        }
        closeModal();
      },
      onCancel: closeModal
    });
  };

  const handleDuplicate = async (e: React.MouseEvent, formId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(null);
    await duplicateForm(formId);
    if (activeWorkspaceId) {
      const formData = await fetchForms(activeWorkspaceId);
      setForms(formData);
    }
  };
  
  const activeWorkspace = workspaces.find(ws => ws.id === activeWorkspaceId);

  const sortedForms = [...forms].sort((a, b) => {
    if (sortBy === 'created') return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    if (sortBy === 'updated') return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
    if (sortBy === 'alphabetical') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  if (loading) return <div className={styles.layout}>Loading dashboard...</div>;

  return (
    <div className={styles.layout}>
      {/* Top Nav */}
      <header className={styles.topNav}>
        <div className={styles.profileDropdown}>
          <div className={styles.profileAvatar}>S</div>
          <span className={styles.profileName}>singhtanmay1202</span>
          <ChevronDown size={14} color="#6b7280" />
        </div>
      </header>

      <div className={styles.contentArea}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <button className={styles.createButton} onClick={handleCreate}>
            <Plus size={18} strokeWidth={2.5} /> Create form
          </button>
          
          <div className={styles.searchBox}>
            <Search size={16} color="#9ca3af" />
            <input type="text" placeholder="Search" />
          </div>

          <div className={styles.workspacesHeader}>
            Workspaces <Plus size={14} style={{ cursor: 'pointer' }} onClick={handleCreateWorkspace} />
          </div>
          
          {workspaces.map(ws => (
            <div 
              key={ws.id} 
              className={styles.workspaceItem} 
              style={{ backgroundColor: activeWorkspaceId === ws.id ? '#f3f4f6' : 'transparent' }}
              onClick={() => setActiveWorkspaceId(ws.id)}
            >
              {ws.name}
            </div>
          ))}
        </aside>

        {/* Main Area */}
        <main className={styles.main}>
          <div className={styles.workspaceTitleRow}>
            <div className={styles.workspaceTitle}>
              {activeWorkspace?.name || 'Workspace'} <MoreHorizontal size={20} />
            </div>
            
            <div className={styles.workspaceActions}>
              <div style={{ position: 'relative' }}>
                <div 
                  className={styles.dateCreatedToggle}
                  onClick={() => setSortMenuOpen(!sortMenuOpen)}
                >
                  {sortBy === 'created' ? <><Calendar size={16}/> Date created</> :
                   sortBy === 'updated' ? <><PenLine size={16}/> Last updated</> :
                   <><ArrowDownAZ size={16}/> Alphabetical</>} 
                  <ChevronDown size={16} />
                </div>
                {sortMenuOpen && (
                  <div className={styles.sortMenu}>
                    <div onClick={() => { setSortBy('created'); setSortMenuOpen(false); }} className={sortBy === 'created' ? styles.sortMenuItemActive : styles.sortMenuItem}>
                      <Calendar size={16}/> Date created
                    </div>
                    <div onClick={() => { setSortBy('updated'); setSortMenuOpen(false); }} className={sortBy === 'updated' ? styles.sortMenuItemActive : styles.sortMenuItem}>
                      <PenLine size={16}/> Last updated
                    </div>
                    <div onClick={() => { setSortBy('alphabetical'); setSortMenuOpen(false); }} className={sortBy === 'alphabetical' ? styles.sortMenuItemActive : styles.sortMenuItem}>
                      <ArrowDownAZ size={16}/> Alphabetical
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.viewToggle}>
                <div 
                  className={`${styles.viewToggleItem} ${viewMode === 'list' ? styles.viewToggleItemActive : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List size={16} /> List
                </div>
                <div 
                  className={`${styles.viewToggleItem} ${viewMode === 'grid' ? styles.viewToggleItemActive : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid size={16} /> Grid
                </div>
              </div>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className={styles.gridContainer}>
              {sortedForms.map((form) => (
                <Link key={form.id} href={`/dashboard/forms/${form.id}/edit`} className={styles.formCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>{form.title}</div>
                    <div style={{ position: 'relative' }}>
                      <button 
                        className={styles.cardMenuTrigger}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpen(menuOpen === form.id ? null : form.id);
                        }}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                      {menuOpen === form.id && (
                        <div className={styles.contextMenu}>
                          <button onClick={(e) => handleRename(e, form)}><Edit2 size={14}/> Rename</button>
                          <button onClick={(e) => handleDuplicate(e, form.id)}><Copy size={14}/> Duplicate</button>
                          <button className={styles.deleteOption} onClick={(e) => handleDelete(e, form.id)}><Trash2 size={14}/> Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <LayoutGrid size={14} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{form.response_count || 0} Responses</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <div>Name</div>
                <div>Responses</div>
                <div>Completed</div>
                <div>Updated</div>
                <div>Integrations</div>
                <div></div>
              </div>
              {sortedForms.map((form) => (
                <Link key={form.id} href={`/dashboard/forms/${form.id}/edit`} className={styles.listRow}>
                  <div className={styles.listRowTitle}>
                    <div className={styles.listIcon} />
                    {form.title}
                  </div>
                  <div className={styles.listStat}>{form.response_count || 0}</div>
                  <div className={styles.listStat}>{form.response_count || 0}</div>
                  <div className={styles.listStat}>{new Date(form.updated_at).toLocaleDateString()}</div>
                  <div className={styles.listStat} style={{ display: 'flex', gap: '4px' }}>
                    <LayoutGrid size={16} color="#9ca3af" />
                  </div>
                  <div style={{ position: 'relative' }}>
                    <button 
                      className={styles.cardMenuTrigger}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setMenuOpen(menuOpen === form.id ? null : form.id);
                      }}
                    >
                      <MoreHorizontal size={18} />
                    </button>
                    {menuOpen === form.id && (
                      <div className={styles.contextMenu}>
                        <button onClick={(e) => handleRename(e, form)}><Edit2 size={14}/> Rename</button>
                        <button onClick={(e) => handleDuplicate(e, form.id)}><Copy size={14}/> Duplicate</button>
                        <button className={styles.deleteOption} onClick={(e) => handleDelete(e, form.id)}><Trash2 size={14}/> Delete</button>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
      
      {/* Custom Modal */}
      {modal.isOpen && (
        <div className={styles.modalOverlay} onClick={modal.onCancel}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{modal.title}</h2>
            {modal.message && <p className={styles.modalMessage}>{modal.message}</p>}
            
            {modal.type === 'prompt' && (
              <input 
                ref={modalInputRef}
                className={styles.modalInput} 
                defaultValue={modal.defaultValue} 
                onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                      modal.onConfirm?.((e.target as HTMLInputElement).value);
                   }
                }}
              />
            )}
            
            <div className={styles.modalActions}>
              {modal.type !== 'alert' && (
                <button className={styles.modalCancelBtn} onClick={modal.onCancel}>Cancel</button>
              )}
              <button 
                className={styles.modalConfirmBtn} 
                style={modal.type === 'confirm' ? { backgroundColor: '#ef4444' } : {}}
                onClick={() => {
                  if (modal.type === 'prompt' && modalInputRef.current) {
                    modal.onConfirm?.(modalInputRef.current.value);
                  } else {
                    modal.onConfirm?.();
                  }
                }}
              >
                {modal.type === 'confirm' ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
