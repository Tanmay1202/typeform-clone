'use client';

import React, { useEffect, useState } from 'react';
import { getFormResponses } from '../../lib/api';
import styles from './ResultsView.module.css';
import { Download, X } from 'lucide-react';

interface ResultsViewProps {
  form: any;
}

export default function ResultsView({ form }: ResultsViewProps) {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);

  useEffect(() => {
    if (form?.id) {
      getFormResponses(form.id)
        .then(data => {
          setResponses(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [form]);

  const questions = form?.questions || [];

  const handleExportCSV = () => {
    if (responses.length === 0) return;
    
    // Header row
    const headers = ['Submitted At', ...questions.map((q: any) => q.title)];
    
    // Data rows
    const csvRows = [headers.join(',')];
    
    responses.forEach(r => {
      const submittedAt = r.submitted_at ? new Date(r.submitted_at).toLocaleString() : 'Incomplete';
      const rowData = [submittedAt];
      
      questions.forEach((q: any) => {
        const answer = r.answers?.find((a: any) => a.question_id === q.id);
        // Escape quotes and wrap in quotes for CSV safety
        let val = answer ? answer.value : '';
        val = val.replace(/"/g, '""');
        rowData.push(`"${val}"`);
      });
      
      csvRows.push(rowData.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${form.title || 'Form'}_Responses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className={styles.container}>Loading results...</div>;
  }

  // Format responses into rows
  const rows = responses.map(r => {
    const rowData: Record<string, any> = {
      id: r.id,
      original: r,
      submittedAt: r.submitted_at ? new Date(r.submitted_at).toLocaleString() : 'Incomplete',
    };
    
    r.answers?.forEach((a: any) => {
      rowData[a.question_id] = a.value;
    });
    
    return rowData;
  });

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Total Responses</div>
            <div className={styles.statValue}>{responses.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statTitle}>Completion Rate</div>
            <div className={styles.statValue}>
              {responses.length > 0 
                ? Math.round((responses.filter(r => r.completed).length / responses.length) * 100) + '%' 
                : '0%'}
            </div>
          </div>
        </div>
        
        {responses.length > 0 && (
          <button className={styles.csvBtn} onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      <div className={styles.tableContainer}>
        {rows.length === 0 ? (
          <div className={styles.emptyState}>
            No responses yet. Publish your form and share the link to start collecting!
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Submitted At</th>
                {questions.map((q: any) => (
                  <th key={q.id} className={styles.th}>{q.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={styles.tr} onClick={() => setSelectedResponse(row)}>
                  <td className={styles.td}>{row.submittedAt}</td>
                  {questions.map((q: any) => (
                    <td key={q.id} className={styles.td}>{row[q.id] || '-'}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detailed Response Modal */}
      {selectedResponse && (
        <div className={styles.modalOverlay} onClick={() => setSelectedResponse(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Response Details</h2>
              <button className={styles.closeBtn} onClick={() => setSelectedResponse(null)}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.qaItem}>
                <div className={styles.qaQuestion}>Submitted At</div>
                <div className={styles.qaAnswer}>{selectedResponse.submittedAt}</div>
              </div>
              {questions.map((q: any) => (
                <div key={q.id} className={styles.qaItem}>
                  <div className={styles.qaQuestion}>{q.title}</div>
                  <div className={styles.qaAnswer}>{selectedResponse[q.id] || <em>No answer provided</em>}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
