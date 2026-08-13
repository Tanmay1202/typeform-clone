'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchForms, createForm } from '../../lib/api';
import styles from './dashboard.module.css';
import { Plus, LayoutGrid, List as ListIcon, Calendar, Users, Sparkles, FolderOpen, Search, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [forms, setForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchForms().then((data) => {
      setForms(data);
      setLoading(false);
    });
  }, []);

  const handleCreate = async () => {
    const title = prompt('Enter form title');
    if (title) {
      const newForm = await createForm({ title });
      router.push(`/dashboard/forms/${newForm.id}/edit`);
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
        <div className={styles.navItem}>
          <Users size={18} /> Contacts
        </div>
        <div className={styles.navItem}>
          <Sparkles size={18} /> Automations
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>My workspace</h1>
          
          <div className={styles.controls}>
            <button className={styles.controlButton}>
              <UserPlus size={16} /> Invite
            </button>
            <button className={styles.controlButton}>
              <Calendar size={16} /> Date created
            </button>
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 6, overflow: 'hidden' }}>
              <button className={styles.controlButton} style={{ border: 'none', borderRadius: 0, borderRight: '1px solid var(--border-color)' }}>
                <ListIcon size={16} /> List
              </button>
              <button className={styles.controlButton} style={{ border: 'none', borderRadius: 0, backgroundColor: '#f0f0f0' }}>
                <LayoutGrid size={16} /> Grid
              </button>
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          {forms.map((form) => (
            <Link key={form.id} href={`/dashboard/forms/${form.id}/edit`} className={styles.card}>
              <div className={styles.cardIcon}>
                <Sparkles size={20} />
              </div>
              <h3 className={styles.cardTitle}>{form.title}</h3>
              <div className={styles.cardFooter}>
                <span>{new Date(form.created_at).toLocaleDateString()}</span>
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
