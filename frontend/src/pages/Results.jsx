import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ScoreStamp from '../components/ScoreStamp'
import KeywordTag from '../components/KeywordTag'
import { mockScans } from '../lib/mockData'

export default function Results() {
  const { id } = useParams()
  const navigate = useNavigate()
  const scan = mockScans.find((s) => s.id === id) || mockScans[0]
  const formattingFlags = [
    'Two-column layout detected — many ATS parsers read columns out of order.',
    'A table was found in the "Skills" section.',
  ]

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <p className="eyebrow mb-2">Scan results</p>
      <h1 className="font-display text-3xl font-semibold mb-1">{scan.jobTitle}</h1>
      <p className="text-ink/50 font-mono text-sm mb-10">{scan.company}</p>

      <div className="bg-white border border-ink/15 rounded-sm p-8 mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow mb-3">Match score</p>
          <ScoreStamp score={scan.score} />
        </div>
        <p className="max-w-xs text-ink/60 text-sm">
          Strong overlap on core tools, but a few JD-specific keywords are missing —
          rewriting a handful of bullets should close most of the gap.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="eyebrow mb-3">Matched keywords</p>
          <div className="flex flex-wrap gap-2">
            {scan.matched.map((k) => <KeywordTag key={k} label={k} state="matched" />)}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-3">Missing keywords</p>
          <div className="flex flex-wrap gap-2">
            {scan.missing.map((k) => <KeywordTag key={k} label={k} state="missing" />)}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <p className="eyebrow mb-3">Formatting flags</p>
        <ul className="space-y-2">
          {formattingFlags.map((f, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink/70">
              <span className="text-amber-dim font-mono">!</span> {f}
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => navigate(`/scan/${scan.id}/rewrite`)} className="btn-primary">
        Rewrite this resume →
      </button>
    </div>
  )
}
