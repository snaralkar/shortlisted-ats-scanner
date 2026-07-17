import React, { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function Settings() {
  const { user, signOut, supabaseConfigured } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <p className="eyebrow mb-2">Account</p>
      <h1 className="font-display text-3xl font-semibold mb-10">Settings</h1>

      <div className="bg-white border border-ink/15 rounded-sm p-6 mb-6">
        <p className="eyebrow mb-4">Profile</p>
        <div className="space-y-4">
          <input className="paper-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
          <input className="paper-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="paper-input" type="password" placeholder="New password" />
          <button className="btn-primary">Save changes</button>
        </div>
      </div>

      <div className="bg-white border border-ink/15 rounded-sm p-6 mb-6">
        <p className="eyebrow mb-4">Plan</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold">{user?.plan || 'Free'}</p>
            <p className="text-sm text-ink/50">1 scan/month, pay-per-rewrite ₹299</p>
          </div>
          <button className="btn-ghost">Upgrade — ₹399/mo</button>
        </div>
        <p className="font-mono text-xs text-ink/40 mt-3">
          Payment integration is stubbed for MVP — Razorpay checkout not yet wired up.
        </p>
      </div>

      {!supabaseConfigured && (
        <p className="font-mono text-xs text-amber-dim mb-6">
          Running in local mock-auth mode — connect Supabase env vars for real accounts.
        </p>
      )}

      <button onClick={signOut} className="font-mono text-sm text-ink/60 hover:text-ink">
        Log out
      </button>
    </div>
  )
}
