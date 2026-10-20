-- Run in the Frankfurt (eu-central-1) Supabase project.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  market text not null,
  program text,
  message text,
  source_page text,
  utm jsonb,
  consent_text text not null,
  consent_at timestamptz not null,
  status text not null default 'new'
);

alter table public.leads enable row level security;
-- Inserts only through the Next.js route with the service-role key.
