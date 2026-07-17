// Thin wrapper around the FastAPI backend.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API ${path} failed: ${res.status} ${text}`)
  }
  return res.json()
}

export const api = {
  scoreResume: (formData) =>
    fetch(`${API_BASE}/scans/score`, { method: 'POST', body: formData }).then((r) => r.json()),
  rewriteResume: (payload) =>
    request('/scans/rewrite', { method: 'POST', body: JSON.stringify(payload) }),
  exportDocx: (payload) =>
    fetch(`${API_BASE}/scans/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }),
}
