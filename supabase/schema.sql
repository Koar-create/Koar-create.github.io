-- Supabase schema for authenticated comments
-- Run in Supabase SQL Editor after creating your project.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  updated_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  lang text not null check (lang in ('en', 'zh')),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text,
  body text not null check (char_length(body) <= 4000),
  parent_id uuid references public.comments (id) on delete cascade,
  created_at timestamptz not null default now(),
  is_approved boolean not null default true
);

create index if not exists comments_slug_lang_idx on public.comments (slug, lang, created_at);

alter table public.profiles enable row level security;
alter table public.comments enable row level security;

-- Profiles: users manage their own row
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- Comments: approved comments are public; authenticated users can insert their own
create policy "comments_select_approved"
  on public.comments for select
  using (is_approved = true);

create policy "comments_insert_authenticated"
  on public.comments for insert
  with check (auth.uid() = user_id and auth.role() = 'authenticated');

create policy "comments_update_own"
  on public.comments for update
  using (auth.uid() = user_id);

create policy "comments_delete_own"
  on public.comments for delete
  using (auth.uid() = user_id);

-- Enable Realtime (optional) in Supabase Dashboard: Database → Replication → comments

-- Auth providers to enable in Dashboard → Authentication → Providers:
-- 1. Email (magic link / OTP)
-- 2. Google OAuth
--
-- Redirect URLs (Authentication → URL Configuration):
--   http://localhost:4321/auth/callback
--   https://koar-create.github.io/auth/callback
