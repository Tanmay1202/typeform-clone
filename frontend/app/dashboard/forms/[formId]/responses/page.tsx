'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getForm, getFormResponses } from '../../../../../lib/api';
import styles from './responses.module.css';

export default function ResponsesPage() {
  const params = useParams();
  const router = useRouter();
  const formId = parseInt(params.formId as string);

  const [form, setForm] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'summary' | 'submissions'>('summary');
  const [selectedResponse, setSelectedResponse] = useState<any>(null);

  useEffect(() => {
    Promise.all([getForm(formId), getFormResponses(formId)])
      .then(([formData, responsesData]) => {
        setForm(formData);
        setResponses(responsesData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [formId]);

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>Form not found.</div>;

  // Compute stats for the summary view
  const computeStats = () => {
    const stats: any = {};
    form.questions.forEach((q: any) => {
      if (q.type === 'MULTIPLE_CHOICE') {
        stats[q.id] = { total: 0, counts: {} };
        q.options.forEach((opt: any) => {
          stats[q.id].counts[opt.label] = 0;
        });
      }
    });

    responses.forEach(res => {
      res.answers.forEach((ans: any) => {
        if (stats[ans.question_id] && ans.value) {
          stats[ans.question_id].total++;
          if (stats[ans.question_id].counts[ans.value] !== undefined) {
            stats[ans.question_id].counts[ans.value]++;
          }
        }
      });
    });

    return stats;
  };

  const stats = computeStats();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{form.title} - Results</h1>
        <button onClick={() => router.push(`/dashboard/forms/${formId}/edit`)}>Back to Builder</button>
      </div>

      <div className={styles.tabs}>
        <div 
          className={`${styles.tab} ${activeTab === 'summary' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'submissions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Submissions ({responses.length})
        </div>
      </div>

      {activeTab === 'summary' && (
        <div>
          {form.questions.map((q: any) => (
            <div key={q.id} className={styles.summarySection}>
              <h3 className={styles.summaryTitle}>{q.order_index + 1}. {q.title}</h3>
              
              {q.type === 'MULTIPLE_CHOICE' ? (
                <div>
                  {q.options.map((opt: any) => {
                    const count = stats[q.id].counts[opt.label] || 0;
                    const total = stats[q.id].total || 1;
                    const percent = Math.round((count / total) * 100);
                    
                    return (
                      <div key={opt.id} className={styles.barChartRow}>
                        <div className={styles.barLabel}>{opt.label}</div>
                        <div className={styles.barContainer}>
                          <div className={styles.barFill} style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className={styles.barValue}>{count} ({percent}%)</div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  {responses.length} responses. View submissions tab for text answers.
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'submissions' && (
        <div>
          {responses.length === 0 ? (
            <p>No responses yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {responses.map((res, idx) => (
                  <tr key={res.id} className={styles.tableRow} onClick={() => setSelectedResponse(res)}>
                    <td>{idx + 1}</td>
                    <td>{new Date(res.submitted_at).toLocaleString()}</td>
                    <td>{res.completed ? 'Completed' : 'Partial'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className={styles.modalOverlay} onClick={() => setSelectedResponse(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.title}>Response #{selectedResponse.id}</h2>
              <button className={styles.closeButton} onClick={() => setSelectedResponse(null)}>&times;</button>
            </div>
            
            <div style={{ marginBottom: '24px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              Submitted: {new Date(selectedResponse.submitted_at).toLocaleString()}
            </div>

            {form.questions.map((q: any) => {
              const answer = selectedResponse.answers.find((a: any) => a.question_id === q.id);
              return (
                <div key={q.id}>
                  <div className={styles.detailQuestion}>{q.title}</div>
                  <div className={styles.detailAnswer}>
                    {answer?.value || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No answer</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
