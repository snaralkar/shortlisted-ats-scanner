import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b border-ink/10 bg-paper/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="font-display text-xl font-semibold tracking-tight">
          Shortlisted<span className="text-mint">.</span>
        </Link>
        {user && (
          <nav className="flex items-center gap-6 font-sans text-sm">
            <Link to="/dashboard" className="hover:text-mint-dim transition-colors">Dashboard</Link>
            <Link to="/scan/new" className="hover:text-mint-dim transition-colors">New scan</Link>
            <Link to="/settings" className="hover:text-mint-dim transition-colors">Settings</Link>
            <button onClick={handleLogout} className="font-mono text-xs border border-ink/30 px-3 py-1.5 rounded-sm hover:border-ink transition-colors">
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  )
}
