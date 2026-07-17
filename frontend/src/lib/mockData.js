// Local mock/demo data so the UI is fully explorable without a live
// Supabase + backend connection. Swap for real Supabase queries once
// env vars are configured (see src/lib/supabase.js).
export const mockUser = {
  id: 'demo-user',
  name: 'Shubham Naralkar',
  email: 'you@example.com',
  plan: 'Free',
}

export const mockScans = [
  {
    id: 'scan-1',
    jobTitle: 'Senior Data Analyst — Business Analysis',
    company: 'Knova One',
    score: 82,
    date: '2026-07-14',
    matched: ['SQL', 'Power BI', 'Stakeholder management', 'Snowflake'],
    missing: ['Tableau', 'Requirements gathering', 'A/B testing'],
  },
  {
    id: 'scan-2',
    jobTitle: 'Mortgage Data Analyst',
    company: 'RiskSpan',
    score: 74,
    date: '2026-07-02',
    matched: ['MISMO', 'Python', 'Databricks'],
    missing: ['Loan origination systems', 'Regulatory reporting'],
  },
  {
    id: 'scan-3',
    jobTitle: 'Business Analyst',
    company: 'Addepar',
    score: 58,
    date: '2026-06-20',
    matched: ['SQL', 'Data visualization'],
    missing: ['Wealth management', 'Portfolio accounting', 'Client onboarding'],
  },
]
