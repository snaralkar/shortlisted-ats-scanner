import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Could not log you in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <p className="eyebrow mb-3">Welcome back</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Log in</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="paper-input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="paper-input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p className="font-mono text-sm text-amber-dim">{error}</p>}
        <button className="btn-primary w-full" disabled={loading}>{loading ? 'Logging in…' : 'Log in'}</button>
      </form>
      <div className="flex justify-between text-sm text-ink/60 mt-6">
        <Link to="/forgot-password" className="hover:text-ink">Forgot password?</Link>
        <Link to="/signup" className="text-mint-dim font-semibold">Create account</Link>
      </div>
    </div>
  )
}
