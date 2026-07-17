import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ScanBeam from '../components/ScanBeam'

export default function NewScan() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [scanning, setScanning] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file || !jobDescription.trim()) return
    setScanning(true)
    try {
      // Real call once the backend is running:
      // const formData = new FormData()
      // formData.append('resume', file)
      // formData.append('job_description', jobDescription)
      // const result = await api.scoreResume(formData)
      await new Promise((r) => setTimeout(r, 1800)) // demo delay for the scan-beam motion
      navigate('/scan/scan-1/results')
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
          <label className="block font-sans text-sm font-semibold mb-2">Job description</label>
          <textarea
            className="paper-input min-h-[200px]"
            placeholder="Paste the full job description here…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
          />
        </div>
        <button className="btn-primary w-full">Scan resume</button>
      </form>
    </div>
  )
}
