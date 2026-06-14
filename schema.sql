-- FitSpace — Running Tracker Schema
-- Paste this into Supabase Dashboard → SQL Editor → Run

create table if not exists public.runs (
  id              uuid        default gen_random_uuid() primary key,
  user_id         uuid        references auth.users(id) on delete cascade not null,
  date            date        not null,
  distance_km     numeric(6,2) not null check (distance_km > 0),
  duration_seconds integer    not null check (duration_seconds > 0),
  notes           text,
  created_at      timestamptz default now() not null
);

-- Row Level Security: every user sees only their own runs
alter table public.runs enable row level security;

create policy "Users can view own runs"
  on public.runs for select
  using (auth.uid() = user_id);

create policy "Users can insert own runs"
  on public.runs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own runs"
  on public.runs for update
  using (auth.uid() = user_id);

create policy "Users can delete own runs"
  on public.runs for delete
  using (auth.uid() = user_id);

-- Index for fast per-user queries sorted by date
create index if not exists runs_user_date_idx on public.runs (user_id, date desc);
