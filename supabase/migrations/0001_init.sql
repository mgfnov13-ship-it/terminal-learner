-- Terminal Space — initial schema.
--
-- Design notes (see /Users/.../plans/vivid-exploring-hoare.md for the full rationale):
--  * Append-only ledger tables (step/lesson/mission completion, achievements, XP events) allow
--    SELECT + INSERT only — no UPDATE/DELETE. This matches the client's own invariant that XP
--    and completion are never taken back, and prevents a compromised client from rewriting
--    history even though it can still insert an untrusted `amount` (see the XP-trust note below).
--  * `user_current_lesson` is a single mutable pointer for the dashboard's "Continue learning"
--    card — deliberately NOT a step-level cursor. Exact step index, hint levels, and revealed
--    answers are device-local Lab-attempt state and are never synced to the cloud (a second
--    device can only rebuild a lesson's *starting* filesystem, not mid-lesson VFS state).
--  * No `user_track_progress` table — track/unit completion percentages are derived client-side
--    from the completion tables against the current (non-planned) curriculum.
--  * `user_activity` intentionally is NOT created here — it ships in a later migration only once
--    a real feature (an activity feed) needs it.

-- ---------------------------------------------------------------- profiles

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row the moment an account is created, so the app never has to handle
-- a signed-in user with no profile row on the happy path (Phase 6 still handles the race where
-- this trigger failed or hasn't landed yet by creating the row on demand).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------- append-only ledgers

create table public.user_step_completion (
  user_id uuid not null references auth.users (id) on delete cascade,
  step_id text not null,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)
);

alter table public.user_step_completion enable row level security;

create policy "user_step_completion_select_own" on public.user_step_completion
  for select using (auth.uid() = user_id);

create policy "user_step_completion_insert_own" on public.user_step_completion
  for insert with check (auth.uid() = user_id);

create table public.user_lesson_completion (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.user_lesson_completion enable row level security;

create policy "user_lesson_completion_select_own" on public.user_lesson_completion
  for select using (auth.uid() = user_id);

create policy "user_lesson_completion_insert_own" on public.user_lesson_completion
  for insert with check (auth.uid() = user_id);

create table public.user_mission_completion (
  user_id uuid not null references auth.users (id) on delete cascade,
  mission_id text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, mission_id)
);

alter table public.user_mission_completion enable row level security;

create policy "user_mission_completion_select_own" on public.user_mission_completion
  for select using (auth.uid() = user_id);

create policy "user_mission_completion_insert_own" on public.user_mission_completion
  for insert with check (auth.uid() = user_id);

create table public.user_achievement (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.user_achievement enable row level security;

create policy "user_achievement_select_own" on public.user_achievement
  for select using (auth.uid() = user_id);

create policy "user_achievement_insert_own" on public.user_achievement
  for insert with check (auth.uid() = user_id);

-- XP is client-trusted at this stage: RLS confines writes to the caller's own account (no
-- cross-account leakage) but nothing here validates that `amount` is legitimate. Acceptable
-- while XP has no competitive/monetary stakes; Phase 16 evaluates moving reward issuance to a
-- server-side RPC that derives/validates the amount instead of trusting the client.
create table public.user_xp_events (
  user_id uuid not null references auth.users (id) on delete cascade,
  event_key text not null,
  amount integer not null check (amount >= 0),
  created_at timestamptz not null default now(),
  primary key (user_id, event_key)
);

alter table public.user_xp_events enable row level security;

create policy "user_xp_events_select_own" on public.user_xp_events
  for select using (auth.uid() = user_id);

create policy "user_xp_events_insert_own" on public.user_xp_events
  for insert with check (auth.uid() = user_id);

-- ------------------------------------------------------------- mutable state

create table public.user_current_lesson (
  user_id uuid primary key references auth.users (id) on delete cascade,
  lesson_id text not null,
  updated_at timestamptz not null default now()
);

alter table public.user_current_lesson enable row level security;

create policy "user_current_lesson_select_own" on public.user_current_lesson
  for select using (auth.uid() = user_id);

create policy "user_current_lesson_insert_own" on public.user_current_lesson
  for insert with check (auth.uid() = user_id);

create policy "user_current_lesson_update_own" on public.user_current_lesson
  for update using (auth.uid() = user_id);

create table public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  theme text not null default 'dark' check (theme in ('dark', 'light', 'system')),
  reduced_motion boolean not null default false,
  lesson_hints boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "user_settings_select_own" on public.user_settings
  for select using (auth.uid() = user_id);

create policy "user_settings_insert_own" on public.user_settings
  for insert with check (auth.uid() = user_id);

create policy "user_settings_update_own" on public.user_settings
  for update using (auth.uid() = user_id);

-- ---------------------------------------------------------- contact submissions

create table public.contact_submissions (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

-- Insert-only for anyone (including anonymous visitors) — no SELECT/UPDATE/DELETE policy exists
-- for anon or authenticated roles, so submissions are only readable via the Supabase dashboard
-- or a service-role context (e.g. an admin tool), never from the client.
create policy "contact_submissions_insert_anyone" on public.contact_submissions
  for insert with check (true);
