import React from 'react'

// The app's signature loading motion: a mint beam sweeping down over a
// document silhouette. Reused for scoring, rewriting, and DOCX generation.
export default function ScanBeam({ label = 'Scanning…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="relative w-64 h-80 bg-white border border-ink/15 rounded-sm overflow-hidden shadow-[0_12px_30px_-10px_rgba(18,23,43,0.35)]">
        <div className="absolute inset-0 p-5 space-y-3 opacity-70">
          {[100, 80, 90, 60, 85, 70, 95, 50].map((w, i) => (
            <div key={i} className="h-2 bg-ink/10 rounded-sm" style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="absolute left-0 right-0 h-24 bg-gradient-to-b from-mint/0 via-mint/40 to-mint/0 animate-scanbeam" />
        <div className="absolute left-0 right-0 h-[2px] bg-mint animate-scanbeam shadow-[0_0_16px_2px_#3DDC97]" />
      </div>
      <p className="font-mono text-sm tracking-wide text-ink/60">{label}</p>
    </div>
  )
}
