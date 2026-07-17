-- Run this in the Supabase SQL editor.
-- `users` is managed automatically by Supabase Auth.

create table if not exists scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  job_title text,
  score int,
  matched_keywords jsonb,
  missing_keywords jsonb,
  formatting_flags jsonb,
  created_at timestamptz default now()
);

create table if not exists rewrites (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid references scans(id) on delete cascade,
  original_text text,
  rewritten_text text,
  accepted boolean default false,
  created_at timestamptz default now()
);

alter table scans enable row level security;
alter table rewrites enable row level security;

create policy "Users can view their own scans"
  on scans for select using (auth.uid() = user_id);
create policy "Users can insert their own scans"
  on scans for insert with check (auth.uid() = user_id);

create policy "Users can view rewrites of their scans"
  on rewrites for select using (
    scan_id in (select id from scans where user_id = auth.uid())
  );
create policy "Users can insert rewrites of their scans"
  on rewrites for insert with check (
    scan_id in (select id from scans where user_id = auth.uid())
  );
