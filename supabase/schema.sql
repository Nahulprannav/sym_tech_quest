create table if not exists public.completions (
  event_id text primary key,
  team_name text not null check (char_length(team_name) between 1 and 50),
  assigned_team text not null check (assigned_team in ('Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon')),
  station smallint not null check (station between 1 and 5),
  score smallint not null check (score between 0 and 3),
  status text not null check (status in ('station complete', 'checkpoint complete', 'mission complete')),
  key text,
  final_phrase text,
  completed_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
alter table public.completions enable row level security;
revoke all on public.completions from anon, authenticated;
grant insert on public.completions to anon;
grant select on public.completions to authenticated;

-- Participants can submit valid event rows without signing in. They cannot read them.
drop policy if exists "participants submit completions" on public.completions;
create policy "participants submit completions"
  on public.completions for insert to anon
  with check (true);

-- Only authenticated organizer accounts can view the results. Disable public sign-ups
-- and create organizer accounts yourself in Supabase Auth.
drop policy if exists "organizers read completions" on public.completions;
create policy "organizers read completions"
  on public.completions for select to authenticated
  using (true);
