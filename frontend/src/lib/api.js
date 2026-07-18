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
  getScans: (userId) =>
    request(`/scans?user_id=${encodeURIComponent(userId)}`),
  scoreResume: async (formData) => {
    const res = await fetch(`${API_BASE}/scans/score`, { method: 'POST', body: formData })
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail.detail || `Scoring failed (${res.status})`)
    }
    return res.json()
  },
  rewriteResume: (payload) =>
    request('/scans/rewrite', { method: 'POST', body: JSON.stringify(payload) }),
  // Returns a Blob (the generated DOCX) rather than JSON.
  exportDocx: async (payload) => {
    const res = await fetch(`${API_BASE}/scans/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail.detail || `Export failed (${res.status})`)
    }
    return res.blob()
  },
}
