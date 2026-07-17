import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { mockScans } from '../lib/mockData'
import ScoreStamp from '../components/ScoreStamp'

export default function Dashboard() {
  const [scans] = useState(mockScans) // TODO: replace with Supabase query on `scans` table
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-6 py-14">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="eyebrow mb-2">Your scans</p>
          <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
        </div>
        <button onClick={() => navigate('/scan/new')} className="btn-primary">+ New scan</button>
      </div>

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
                <p className="font-mono text-xs text-ink/50 mt-1">{s.company} · {s.date}</p>
              </div>
              <ScoreStamp score={s.score} size="sm" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
