import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/AuthContext'
import { ScanProvider } from './lib/ScanContext'
import Navbar from './components/Navbar'

import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import NewScan from './pages/NewScan'
import Results from './pages/Results'
import Rewrite from './pages/Rewrite'
import Download from './pages/Download'
import Settings from './pages/Settings'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="py-24 text-center font-mono text-sm text-ink/50">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/scan/new" element={<ProtectedRoute><NewScan /></ProtectedRoute>} />
        <Route path="/scan/:id/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/scan/:id/rewrite" element={<ProtectedRoute><Rewrite /></ProtectedRoute>} />
        <Route path="/scan/:id/download" element={<ProtectedRoute><Download /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ScanProvider>
        <AppRoutes />
      </ScanProvider>
    </AuthProvider>
  )
}
