import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mockScans } from '../lib/mockData'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import ScoreStamp from '../components/ScoreStamp'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scans, setScans] = useState(mockScans)
  const [usingRealData, setUsingRealData] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    api
      .getScans(user.id)
      .then((realScans) => {
        if (cancelled) return
        // Backend returns [] both when Supabase isn't configured yet and
        // when the user genuinely has no scans — either way, keep showing
        // the demo cards until there's at least one real scan to display.
        if (realScans && realScans.length > 0) {
          setScans(
            realScans.map((s) => ({
              id: s.id,
              jobTitle: s.job_title,
              company: '',
              score: s.score,
              date: (s.created_at || '').slice(0, 10),
              matched: s.matched_keywords || [],
              missing: s.missing_keywords || [],
            }))
          )
          setUsingRealData(true)
        }
      })
      .catch(() => {
        // Backend unreachable — silently keep demo data, don't block the dashboard.
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [user?.id])

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="eyebrow mb-2">Your scans</p>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        </div>
        <button onClick={() => navigate('/scan/new')} className="btn-primary">+ New scan</button>
      </div>

      {!usingRealData && !loading && (
        <p className="font-mono text-xs text-ink/40 mb-6">
          Showing demo scans — run a real scan to see it here.
        </p>
      )}

      {scans.length === 0 ? (
        <div className="border border-dashed border-ink/30 rounded-sm p-12 text-center">
          <p className="text-ink/60 mb-4">No scans yet. Upload a resume and a job description to get your first score.</p>
          <button onClick={() => navigate('/scan/new')} className="btn-primary">Run your first scan</button>
        </div>
      ) : (
        <div className="space-y-4">
          {scans.map((s) => (
            <Link
              to={`/scan/${s.id}/results`}
              key={s.id}
              className="group flex items-center justify-between bg-white border border-ink/15 rounded-sm px-6 py-5 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-12px_rgba(18,23,43,0.35)] transition-all relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-ink/10 group-hover:bg-mint transition-colors" />
              <div className="pl-3">
                <p className="font-display text-lg font-semibold">{s.jobTitle}</p>
                <p className="font-mono text-xs text-ink/50 mt-1">{s.company ? `${s.company} · ` : ''}{s.date}</p>
              </div>
              <ScoreStamp score={s.score} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
