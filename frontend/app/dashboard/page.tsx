'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchForms, createForm, updateForm, deleteForm } from '../../lib/api';
import styles from './dashboard.module.css';
import { Plus, FolderOpen, MoreVertical, Edit2, Trash2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const router = useRouter();

  const loadForms = () => {
    fetchForms().then((data) => {
      setForms(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCreate = async () => {
    const title = prompt('Enter form title');
    if (title) {
      const newForm = await createForm({ title });
      router.push(`/dashboard/forms/${newForm.id}/edit`);
    }
  };

  const handleRename = async (e: React.MouseEvent, form: any) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(null);
    const newTitle = prompt('Enter new form title', form.title);
    if (newTitle && newTitle !== form.title) {
      await updateForm(form.id, { title: newTitle });
      loadForms();
    }
  };

  const handleDelete = async (e: React.MouseEvent, formId: number) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuOpen(null);
    if (confirm('Are you sure you want to delete this form?')) {
      await deleteForm(formId);
      loadForms();
    }
  };

  if (loading) return <div className={styles.layout}>Loading forms...</div>;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <button className={styles.createButton} onClick={handleCreate}>
          <Plus size={20} /> Create form
        </button>

        <div className={styles.navItem + ' ' + styles.navItemActive}>
          <FolderOpen size={18} /> Forms
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>My workspace</h1>
        </div>

        <div className={styles.grid}>
          {forms.map((form) => (
            <Link key={form.id} href={`/dashboard/forms/${form.id}/edit`} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.cardIcon}>
                  <Sparkles size={20} />
                </div>
                <div className={styles.cardMenuWrapper}>
                  <button 
                    className={styles.menuTrigger}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMenuOpen(menuOpen === form.id ? null : form.id);
                    }}
                  >
                    <MoreVertical size={20} />
                  </button>
                  {menuOpen === form.id && (
                    <div className={styles.contextMenu}>
                      <button onClick={(e) => handleRename(e, form)}><Edit2 size={14}/> Rename</button>
                      <button className={styles.deleteOption} onClick={(e) => handleDelete(e, form.id)}><Trash2 size={14}/> Delete</button>
                    </div>
                  )}
                </div>
              </div>
              
              <h3 className={styles.cardTitle}>{form.title}</h3>
              <div className={styles.cardFooter}>
                <span>0 Responses</span>
                <span className={styles.status}>{form.status}</span>
              </div>
            </Link>
          ))}
          
          <div className={`${styles.card} ${styles.newFormCard}`} onClick={handleCreate}>
            <Plus size={24} />
            <span style={{ fontWeight: 500 }}>New form</span>
          </div>
        </div>
      </main>
    </div>
  );
}
