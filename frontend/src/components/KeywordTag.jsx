import React from 'react'

export default function KeywordTag({ label, state = 'matched' }) {
  const styles = state === 'matched'
    ? 'bg-mint/15 text-mint-dim border-mint/40'
    : 'bg-amber/15 text-amber-dim border-amber/40'
  return (
    <span className={`inline-block font-mono text-xs px-2.5 py-1 rounded-sm border ${styles}`}>
      {label}
    </span>
  )
}
