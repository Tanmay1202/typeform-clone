'use client';

import React from 'react';
import styles from './builder.module.css';

interface FormSettingsPanelProps {
  form: any;
  onUpdate: (data: any) => void;
}

export default function FormSettingsPanel({ form, onUpdate }: FormSettingsPanelProps) {
  if (!form) return null;

  return (
    <div className={styles.editorPanel}>
      <div className={styles.editorSection}>
        <label>Form Title</label>
        <input 
          type="text" 
          className={styles.editorInput}
          value={form.title || ''}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />
      </div>

      <div className={styles.editorSection}>
        <label>Description</label>
        <textarea 
          className={styles.editorTextarea}
          rows={3}
          value={form.description || ''}
          onChange={(e) => onUpdate({ description: e.target.value })}
        />
      </div>

      <div className={styles.editorSection} style={{ marginTop: 24 }}>
        <h3 className={styles.sectionTitle}>Thank You Screen</h3>
        <label>Message</label>
        <textarea 
          className={styles.editorTextarea}
          rows={3}
          value={form.thank_you_message || ''}
          onChange={(e) => onUpdate({ thank_you_message: e.target.value })}
          placeholder="Thank you for completing this form!"
        />
      </div>
      
      <div className={styles.editorSection} style={{ marginTop: 24 }}>
        <h3 className={styles.sectionTitle}>Theme Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Background Color</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
              <input 
                type="color" 
                value={form.theme_settings?.background_color || '#f9fafb'}
                onChange={(e) => {
                  const newTheme = { ...(form.theme_settings || {}), background_color: e.target.value };
                  onUpdate({ theme_settings: newTheme });
                }}
                style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {form.theme_settings?.background_color || '#f9fafb'}
              </span>
            </div>
          </div>
          <div>
            <label>Text / Primary Color</label>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
              <input 
                type="color" 
                value={form.theme_settings?.primary_color || '#111827'}
                onChange={(e) => {
                  const newTheme = { ...(form.theme_settings || {}), primary_color: e.target.value };
                  onUpdate({ theme_settings: newTheme });
                }}
                style={{ width: '40px', height: '40px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                {form.theme_settings?.primary_color || '#111827'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
