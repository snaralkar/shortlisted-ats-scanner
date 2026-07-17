import React from 'react'

// Score is always a stamped serif numeral — never a progress ring.
export default function ScoreStamp({ score, size = 'lg' }) {
  const color = score >= 75 ? 'text-mint-dim' : score >= 50 ? 'text-amber-dim' : 'text-ink'
  const sizes = size === 'lg' ? 'text-7xl' : 'text-4xl'
  return (
    <div className={`inline-flex items-end gap-1 ${color} animate-stampIn -rotate-3 select-none`}>
      <span className={`font-display font-semibold ${sizes} leading-none`}>{score}</span>
      <span className="font-mono text-lg mb-1 opacity-70">/100</span>
    </div>
  )
}
