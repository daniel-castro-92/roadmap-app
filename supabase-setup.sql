-- Run this in your Supabase SQL Editor

-- Create the table (if not already done)
create table if not exists public.roadmap (
  id text primary key,
  data jsonb not null default '{"milestones": []}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Grant access to the anon role (required for the app to work)
grant select, insert, update on public.roadmap to anon;

-- Seed an empty roadmap row
insert into public.roadmap (id, data, updated_at)
values ('main', '{"milestones": []}', now())
on conflict (id) do nothing;
