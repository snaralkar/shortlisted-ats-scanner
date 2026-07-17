// Supabase client — wired up but requires env vars to actually connect.
// Fill VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env
// See /backend/.env.example for the matching backend keys.
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(url && anonKey)

export const supabase = supabaseConfigured
  ? createClient(url, anonKey)
  : null

if (!supabaseConfigured) {
  // eslint-disable-next-line no-console
  console.warn(
    '[Shortlisted] Supabase env vars are missing — running in local mock-auth mode. ' +
    'Add VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY to frontend/.env to enable real auth.'
  )
}
