export const API_BASE = 'http://localhost:8000/api';

export async function fetchWorkspaces() {
  const res = await fetch(`${API_BASE}/workspaces/`);
  if (!res.ok) throw new Error('Failed to fetch workspaces');
  return res.json();
}

export async function createWorkspace(data: { name: string }) {
  const res = await fetch(`${API_BASE}/workspaces/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create workspace');
  return res.json();
}

export async function fetchForms(workspaceId?: number) {
  const url = workspaceId ? `${API_BASE}/forms/?workspace_id=${workspaceId}` : `${API_BASE}/forms/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch forms');
  return res.json();
}

export async function createForm(data: { title: string; description?: string; workspace_id: number }) {
  const res = await fetch(`${API_BASE}/forms/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create form');
  return res.json();
}

export async function getForm(id: number) {
  const res = await fetch(`${API_BASE}/forms/${id}`);
  if (!res.ok) throw new Error('Failed to fetch form');
  return res.json();
}

export async function updateForm(id: number, data: any) {
  const res = await fetch(`${API_BASE}/forms/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update form');
  return res.json();
}

export async function createQuestion(formId: number, data: any) {
  const res = await fetch(`${API_BASE}/forms/${formId}/questions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create question');
  return res.json();
}

export async function updateQuestion(formId: number, questionId: number, data: any) {
  const res = await fetch(`${API_BASE}/forms/${formId}/questions/${questionId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update question');
  return res.json();
}

export async function deleteQuestion(formId: number, questionId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}/questions/${questionId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete question');
  return res.json();
}

export async function reorderQuestions(formId: number, questionIds: number[]) {
  const res = await fetch(`${API_BASE}/forms/${formId}/questions/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question_ids: questionIds }),
  });
  if (!res.ok) throw new Error('Failed to reorder questions');
  return res.json();
}

export async function deleteForm(id: number) {
  const res = await fetch(`${API_BASE}/forms/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete form');
  return res.json();
}

export async function duplicateForm(id: number) {
  const res = await fetch(`${API_BASE}/forms/${id}/duplicate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to duplicate form');
  return res.json();
}

export async function getPublicForm(shareSlug: string) {
  const res = await fetch(`${API_BASE}/public/f/${shareSlug}`);
  if (!res.ok) throw new Error('Failed to fetch public form');
  return res.json();
}

export async function submitResponse(shareSlug: string, data: any) {
  const res = await fetch(`${API_BASE}/public/f/${shareSlug}/responses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit response');
  return res.json();
}

export async function getFormResponses(formId: number) {
  const res = await fetch(`${API_BASE}/forms/${formId}/responses/`);
  if (!res.ok) throw new Error('Failed to fetch responses');
  return res.json();
}
