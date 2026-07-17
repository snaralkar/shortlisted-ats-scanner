import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScanBeam from '../components/ScanBeam'
import { api } from '../lib/api'
import { useScan } from '../lib/ScanContext'
import { useAuth } from '../lib/AuthContext'

export default function NewScan() {
  const navigate = useNavigate()
  const { updateScan } = useScan()
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !jobDescription.trim()) return
    setError('')
    setScanning(true)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('job_description', jobDescription)
      formData.append('job_title', jobTitle || 'Untitled role')
      formData.append('user_id', user?.id || 'anonymous')

      const result = await api.scoreResume(formData)

      updateScan({
        jobTitle: jobTitle || 'Untitled role',
        resumeText: result.resume_text,
        score: result.score,
        matched: result.matched_keywords,
        missing: result.missing_keywords,
        formattingFlags: result.formatting_flags,
        summary: result.summary,
        scanId: result.scan_id,
        rows: null,
        docxUrl: null,
      })
      navigate('/scan/current/results')
    } catch (err) {
      setError(
        err.message?.includes('Failed to fetch')
          ? "Couldn't reach the backend. Check VITE_API_BASE and that the API is running."
          : err.message || 'Something went wrong scanning your resume.'
      )
    } finally {
      setScanning(false)
    }
  }

  if (scanning) return <ScanBeam label="Comparing resume against job description…" />

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <p className="eyebrow mb-2">New scan</p>
      <h1 className="font-display text-3xl font-semibold mb-8">Upload &amp; compare</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-sans text-sm font-semibold mb-2">Resume (PDF or DOCX)</label>
          <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-ink/30 rounded-sm py-10 cursor-pointer hover:border-mint hover:bg-mint/5 transition-colors">
            <span className="font-mono text-sm text-ink/60">
              {file ? file.name : 'Click to choose a file, or drag it here'}
            </span>
            <input
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </label>
        </div>
        <div>
          <label className="block font-sans text-sm font-semibold mb-2">Job title (optional)</label>
          <input
            className="paper-input"
            placeholder="e.g. Senior Data Analyst — Business Analysis"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-sans text-sm font-semibold mb-2">Job description</label>
          <textarea
            className="paper-input min-h-[200px]"
            placeholder="Paste the full job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>
        {error && <p className="font-mono text-sm text-amber-dim">{error}</p>}
        <button className="btn-primary w-full">Scan resume</button>
      </form>
    </div>
  )
}
