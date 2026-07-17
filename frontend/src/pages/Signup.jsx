import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, name)
      // TODO: real email verification step goes here once Supabase email
      // templates are configured. For MVP we go straight to the dashboard.
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Could not create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="eyebrow mb-3">Create account</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Start scanning</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="paper-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="paper-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="paper-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
        {error && <p className="font-mono text-sm text-amber-dim">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Creating…' : 'Create account'}</button>
        <button type="button" className="btn-ghost w-full">Continue with Google</button>
      </form>
      <p className="text-sm text-ink/60 mt-6">
        Already have an account? <Link to="/login" className="text-mint-dim font-semibold">Log in</Link>
      </p>
    </div>
  )
}
