import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow mb-4">Resume ATS scanner + rewriter</p>
          <h1 className="font-display text-5xl md:text-6xl font-semibold leading-[1.05] mb-6">
            Know exactly why the ATS<br />is skipping your resume.
          </h1>
          <p className="text-ink/70 text-lg mb-8 max-w-md">
            Upload your resume and a job description. Get a stamped match score,
            the keywords you're missing, and a bullet-by-bullet rewrite — before
            you hit apply.
          </p>
          <div className="flex gap-4">
            <Link to="/signup" className="btn-primary">Scan your resume</Link>
            <Link to="/login" className="btn-ghost">Log in</Link>
          </div>
        </div>
        <div className="relative">
          <div className="bg-white border border-ink/15 rounded-sm p-6 shadow-[0_20px_50px_-15px_rgba(18,23,43,0.35)] -rotate-1">
            <div className="flex items-center justify-between mb-6">
              <span className="eyebrow">Match score</span>
              <span className="font-mono text-xs text-ink/40">senior_data_analyst.pdf</span>
            </div>
            <div className="flex items-end gap-1 -rotate-3 text-mint-dim mb-6">
              <span className="font-display font-semibold text-6xl leading-none">82</span>
              <span className="font-mono text-lg mb-1 opacity-70">/100</span>
            </div>
            <div className="space-y-2">
              {['SQL', 'Power BI', 'Snowflake'].map((k) => (
                <div key={k} className="font-mono text-xs bg-mint/15 text-mint-dim border border-mint/40 rounded-sm px-2.5 py-1 inline-block mr-2">{k}</div>
              ))}
              {['Tableau', 'A/B testing'].map((k) => (
                <div key={k} className="font-mono text-xs bg-amber/15 text-amber-dim border border-amber/40 rounded-sm px-2.5 py-1 inline-block mr-2">{k}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-white/40">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-10">
          {[
            { t: 'Scan', d: 'Upload a resume and paste the job description. We extract text and diff it against the role.' },
            { t: 'Score', d: 'A stamped score out of 100, matched and missing keywords, and formatting flags ATS parsers choke on.' },
            { t: 'Rewrite', d: 'Bullet-by-bullet rewrites that work in the missing keywords honestly — you approve every line.' },
          ].map((f) => (
            <div key={f.t}>
              <h3 className="font-display text-2xl font-semibold mb-2">{f.t}</h3>
              <p className="text-ink/60">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
