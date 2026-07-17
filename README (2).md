# Shortlisted — Resume ATS Scanner + Rewriter

Full-stack MVP scaffold: React/Tailwind frontend + FastAPI backend, built from
the product brief. Runs today in **local demo mode** (mock auth + mock scan
data, fully clickable) and is wired up to flip on real Supabase auth + a live
Claude-powered backend as soon as you add API keys — no code changes needed.

## What's here

```
frontend/   React + Vite + Tailwind. Every screen in the brief:
            landing, signup, login, forgot password, dashboard,
            new scan, results, rewrite, download, settings.
backend/    FastAPI. Resume parsing (pdfplumber/python-docx),
            Claude scoring + rewrite calls, DOCX export, Supabase
            persistence hooks.
```

## Design system (as specified in the brief)

- Ink-navy `#12172B` / paper `#E9EBF1` / mint `#3DDC97` (matched) / amber `#FFB020` (missing)
- Fraunces (display/scores) + Inter (body) + IBM Plex Mono (data/keywords/scores)
- "Scan beam" motion as the universal loading state (`src/components/ScanBeam.jsx`)
- Score always a stamped serif numeral, never a progress ring (`ScoreStamp.jsx`)

## Run the frontend

```bash
cd frontend
npm install
cp .env.example .env   # leave blank to stay in local mock-auth/demo-data mode
npm run dev
```

Open http://localhost:5173. Sign up with any email/password — in mock mode
this just stores a fake session in localStorage so you can click through the
whole flow (dashboard → new scan → results → rewrite → download → settings)
without any backend running.

## Run the backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add ANTHROPIC_API_KEY at minimum
uvicorn main:app --reload
```

API comes up on http://localhost:8000. `POST /scans/score` expects a
multipart form (`resume` file + `job_description` text) and calls Claude with
the exact scoring prompt from the brief, returning strict JSON. `POST
/scans/rewrite` and `POST /scans/export` handle the rewrite step and DOCX
generation the same way.

## Going from demo mode to fully wired up

1. **Auth** — create a Supabase project, run `backend/schema.sql` in the SQL
   editor, then fill `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` in
   `frontend/.env`. `src/lib/AuthContext.jsx` auto-detects real Supabase and
   stops using mock/localStorage auth.
2. **AI scoring/rewrite** — add `ANTHROPIC_API_KEY` to `backend/.env`.
3. **Persistence** — add `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` to
   `backend/.env` so `db.py` starts writing to the `scans`/`rewrites` tables.
4. **Frontend ↔ backend** — replace the `setTimeout` demo delays in
   `NewScan.jsx` and `Rewrite.jsx` with the real `api.scoreResume(...)` /
   `api.exportDocx(...)` calls already stubbed in `src/lib/api.js`.

## Explicitly out of scope (per brief)

Razorpay payment logic (UI for plan tiers is built, checkout is stubbed),
LinkedIn optimization, team accounts, email notifications. Email verification
on signup is a TODO — currently signup goes straight to the dashboard.

## Deploying

Frontend → Vercel (`npm run build`, output in `frontend/dist`).
Backend → Render (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
