import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ScanBeam from '../components/ScanBeam'

const demoRewrites = [
  {
    id: 'r1',
    original: 'Responsible for building dashboards for the mortgage team.',
    rewritten: 'Built Power BI and Tableau dashboards for the mortgage team, reducing manual reporting time by [add %].',
    reason: 'Added "Tableau" (missing keyword) and a metrics placeholder.',
    status: 'pending', // pending | accepted | rejected | edited
  },
  {
    id: 'r2',
    original: 'Worked with stakeholders to gather requirements.',
    rewritten: 'Led requirements gathering sessions with cross-functional stakeholders to define reporting needs ahead of quarterly releases.',
    reason: 'Added "Requirements gathering" (missing keyword) and stronger action verb.',
    status: 'pending',
  },
  {
    id: 'r3',
    original: 'Used SQL and Snowflake for data analysis.',
    rewritten: 'Queried and modeled large-scale datasets in Snowflake using SQL, supporting A/B testing analysis for product decisions.',
    reason: 'Added "A/B testing" (missing keyword) naturally into existing tool experience.',
    status: 'pending',
  },
]

export default function Rewrite() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [rows, setRows] = useState(demoRewrites)
  const [generating, setGenerating] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const setStatus = (rowId, status) =>
    setRows((rs) => rs.map((r) => (r.id === rowId ? { ...r, status } : r)))

  const setText = (rowId, text) =>
    setRows((rs) => rs.map((r) => (r.id === rowId ? { ...r, rewritten: text } : r)))

  const handleGenerate = async () => {
    setGenerating(true)
    // Real call: await api.exportDocx({ scanId: id, rows })
    await new Promise((r) => setTimeout(r, 1600))
    navigate(`/scan/${id}/download`)
  }

  if (generating) return <ScanBeam label="Generating your rewritten resume…" />

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="eyebrow mb-2">Rewrite</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Review each change</h1>

      <div className="space-y-6 mb-10">
        {rows.map((row) => (
          <div key={row.id} className="bg-white border border-ink/15 rounded-sm p-6">
            <p className="eyebrow mb-2">Before</p>
            <p className="text-ink/50 line-through decoration-amber/70 mb-4 text-sm">{row.original}</p>

            <p className="eyebrow mb-2">After</p>
            {editingId === row.id ? (
              <textarea
                className="paper-input mb-4 text-sm"
                value={row.rewritten}
                onChange={(e) => setText(row.id, e.target.value)}
                autoFocus
              />
            ) : (
              <p className="text-ink mb-4 text-sm">{row.rewritten}</p>
            )}

            <p className="font-mono text-xs text-mint-dim mb-4">{row.reason}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatus(row.id, 'accepted')}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border ${row.status === 'accepted' ? 'bg-mint/20 border-mint text-mint-dim' : 'border-ink/20 hover:border-ink'}`}
              >
                Accept
              </button>
              <button
                onClick={() => setEditingId(editingId === row.id ? null : row.id)}
                className="font-mono text-xs px-3 py-1.5 rounded-sm border border-ink/20 hover:border-ink"
              >
                {editingId === row.id ? 'Done editing' : 'Edit'}
              </button>
              <button
                onClick={() => setStatus(row.id, 'rejected')}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border ${row.status === 'rejected' ? 'bg-amber/20 border-amber text-amber-dim' : 'border-ink/20 hover:border-ink'}`}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleGenerate} className="btn-primary">Generate final resume →</button>
    </div>
  )
}
