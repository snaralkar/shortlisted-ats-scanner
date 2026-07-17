import React, { createContext, useContext, useState } from 'react'

// Holds the in-progress scan (score result, resume text, rewrite rows,
// generated DOCX) as the user moves through New Scan -> Results -> Rewrite
// -> Download. Backed by nothing persistent yet — once GET /scans/:id
// exists on the backend, Results/Rewrite/Download can fetch by real id
// instead of reading this context.
const ScanContext = createContext(null)

export function ScanProvider({ children }) {
  const [currentScan, setCurrentScan] = useState(null)
  // shape: { jobTitle, resumeText, score, matched, missing, formattingFlags,
  //          summary, rows: [{original, rewritten, reason, status}], docxUrl }

  const updateScan = (patch) => setCurrentScan((s) => ({ ...(s || {}), ...patch }))

  return (
    <ScanContext.Provider value={{ currentScan, setCurrentScan, updateScan }}>
      {children}
    </ScanContext.Provider>
  )
}

export const useScan = () => useContext(ScanContext)
