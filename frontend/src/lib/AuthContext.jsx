import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from './supabase'
import { mockUser } from './mockData'

const AuthContext = createContext(null)

// In mock mode (no Supabase env vars) auth is simulated with localStorage
// so the full signup -> login -> dashboard -> logout flow is still testable.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => sub.subscription.unsubscribe()
    } else {
      const stored = localStorage.getItem('shortlisted_mock_user')
      setUser(stored ? JSON.parse(stored) : null)
      setLoading(false)
    }
  }, [])

  const signUp = async (email, password, name) => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
      if (error) throw error
    } else {
      const fake = { ...mockUser, email, name }
      localStorage.setItem('shortlisted_mock_user', JSON.stringify(fake))
      setUser(fake)
    }
  }

  const signIn = async (email, password) => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } else {
      const fake = { ...mockUser, email }
      localStorage.setItem('shortlisted_mock_user', JSON.stringify(fake))
      setUser(fake)
    }
  }

  const signOut = async () => {
    if (supabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('shortlisted_mock_user')
      setUser(null)
    }
  }

  const resetPassword = async (email) => {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
    }
    // Mock mode: no-op, UI shows confirmation regardless.
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword, supabaseConfigured }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
