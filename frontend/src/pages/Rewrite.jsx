import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import ScanBeam from '../components/ScanBeam'
import { api } from '../lib/api'
import { useScan } from '../lib/ScanContext'

const demoRewrites = [
  {
    original: 'Responsible for building dashboards for the mortgage team.',
    rewritten: 'Built Power BI and Tableau dashboards for the mortgage team, reducing manual reporting time by [add %].',
    reason: 'Added "Tableau" (missing keyword) and a metrics placeholder.',
  },
  {
    original: 'Worked with stakeholders to gather requirements.',
    rewritten: 'Led requirements gathering sessions with cross-functional stakeholders to define reporting needs ahead of quarterly releases.',
    reason: 'Added "Requirements gathering" (missing keyword) and stronger action verb.',
  },
  {
    original: 'Used SQL and Snowflake for data analysis.',
    rewritten: 'Queried and modeled large-scale datasets in Snowflake using SQL, supporting A/B testing analysis for product decisions.',
    reason: 'Added "A/B testing" (missing keyword) naturally into existing tool experience.',
  },
]

export default function Rewrite() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentScan, updateScan } = useScan()
  const isLive = id === 'current'

  const [rows, setRows] = useState(null)
  const [loading, setLoading] = useState(isLive)
  const [generating, setGenerating] = useState(false)
  const [editingIdx, setEditingIdx] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLive) {
      setRows(demoRewrites.map((r) => ({ ...r, status: 'pending' })))
      return
    }
    if (!currentScan) return
    if (currentScan.rows) {
      setRows(currentScan.rows)
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    api
      .rewriteResume({ resume_text: currentScan.resumeText, missing_keywords: currentScan.missing })
      .then((result) => {
        if (cancelled) return
        const newRows = result.rewrites.map((r) => ({ ...r, status: 'pending' }))
        setRows(newRows)
        updateScan({ rows: newRows })
      })
      .catch((err) => !cancelled && setError(err.message || 'Could not generate rewrites.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLive, currentScan])

  if (isLive && !currentScan) return <Navigate to="/scan/new" replace />

  const setStatus = (idx, status) =>
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, status } : r)))
  const setText = (idx, text) =>
    setRows((rs) => rs.map((r, i) => (i === idx ? { ...r, rewritten: text } : r)))

  const handleGenerate = async () => {
    setError('')
    if (!isLive) {
      // Demo mode: no backend call, just move on.
      setGenerating(true)
      await new Promise((r) => setTimeout(r, 1200))
      navigate(`/scan/${id}/download`)
      return
    }
    setGenerating(true)
    try {
      const accepted = rows.filter((r) => r.status !== 'rejected')
      const blob = await api.exportDocx({
        scan_id: currentScan.scanId,
        resume_text: currentScan.resumeText,
        rows: accepted.map(({ original, rewritten, reason }) => ({ original, rewritten, reason })),
      })
      const docxUrl = URL.createObjectURL(blob)
      updateScan({ rows, docxUrl })
      navigate('/scan/current/download')
    } catch (err) {
      setError(err.message || 'Could not generate the final resume.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <ScanBeam label="Finding weak bullet points to strengthen…" />
  if (generating) return <ScanBeam label="Generating your rewritten resume…" />
  if (!rows) return null

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="eyebrow mb-2">Rewrite</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Review each change</h1>

      {error && <p className="font-mono text-sm text-amber-dim mb-6">{error}</p>}

      <div className="space-y-6 mb-10">
        {rows.map((row, idx) => (
          <div key={idx} className="bg-white border border-ink/15 rounded-sm p-6">
            <p className="eyebrow mb-2">Before</p>
            <p className="text-ink/50 line-through decoration-amber/70 mb-4 text-sm">{row.original}</p>

            <p className="eyebrow mb-2">After</p>
            {editingIdx === idx ? (
              <textarea
                className="paper-input mb-4 text-sm"
                value={row.rewritten}
                onChange={(e) => setText(idx, e.target.value)}
                autoFocus
              />
            ) : (
              <p className="text-ink mb-4 text-sm">{row.rewritten}</p>
            )}

            <p className="font-mono text-xs text-mint-dim mb-4">{row.reason}</p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setStatus(idx, 'accepted')}
                className={`font-mono text-xs px-3 py-1.5 rounded-sm border ${row.status === 'accepted' ? 'bg-mint/20 border-mint text-mint-dim' : 'border-ink/20 hover:border-ink'}`}
              >
                Accept
              </button>
              <button
                onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                className="font-mono text-xs px-3 py-1.5 rounded-sm border border-ink/20 hover:border-ink"
              >
                {editingIdx === idx ? 'Done editing' : 'Edit'}
              </button>
              <button
                onClick={() => setStatus(idx, 'rejected')}
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
