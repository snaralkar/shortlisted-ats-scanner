import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await resetPassword(email)
    setSent(true)
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="eyebrow mb-3">Account recovery</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Reset your password</h1>
      {sent ? (
        <p className="text-ink/70">
          If an account exists for <span className="font-mono">{email}</span>, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="paper-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn-primary w-full">Send reset link</button>
        </form>
      )}
      <p className="text-sm text-ink/60 mt-6">
        <Link to="/login" className="text-mint-dim font-semibold">Back to log in</Link>
      </p>
    </div>
  )
}
