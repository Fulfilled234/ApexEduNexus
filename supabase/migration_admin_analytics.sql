-- Run this once in your Supabase project's SQL editor.
-- Adds: an admin flag on profiles, and an event log the admin dashboard reads from.

-- 1. Admin flag. Defaults to false for everyone; flip it manually for yourself:
--    update edu_profiles set is_admin = true where id = '<your-user-uuid>';
alter table edu_profiles add column if not exists is_admin boolean not null default false;

-- 2. AI generation event log — one row per generation attempt (quiz or flashcards),
--    used by /api/admin-stats to build the analytics dashboard.
create table if not exists edu_ai_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  feature text not null check (feature in ('quiz', 'flashcards', 'unknown')),
  key_type text not null check (key_type in ('platform', 'personal')),
  status text not null check (status in ('success', 'error', 'rate_limited')),
  error_message text,
  created_at timestamptz not null default now()
);

create index if not exists edu_ai_events_created_at_idx on edu_ai_events (created_at desc);
create index if not exists edu_ai_events_user_id_idx on edu_ai_events (user_id);

-- RLS: this table is only ever written/read by the serverless functions using
-- the service-role key, which bypasses RLS. Enable RLS with no policies so it's
-- still locked down if anon/authenticated clients ever try to hit it directly.
alter table edu_ai_events enable row level security;
