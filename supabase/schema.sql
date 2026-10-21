-- Supabase schema for anonymous comments
-- Run in Supabase SQL Editor after creating your project.

-- Drop legacy auth-based profile table if migrating from an older schema
drop table if exists public.profiles cascade;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  lang text not null check (lang in ('en', 'zh')),
  user_id uuid,
  author_name text check (author_name is null or char_length(author_name) <= 80),
  body text not null check (char_length(trim(body)) >= 1 and char_length(body) <= 4000),
  parent_id uuid references public.comments (id) on delete cascade,
  created_at timestamptz not null default now(),
  is_approved boolean not null default true
);

-- If table already exists with NOT NULL user_id, allow anonymous inserts
alter table public.comments alter column user_id drop not null;

create index if not exists comments_slug_lang_idx on public.comments (slug, lang, created_at);

alter table public.comments enable row level security;

-- Drop legacy policies if migrating from an older schema
drop policy if exists "comments_insert_authenticated" on public.comments;
drop policy if exists "comments_update_own" on public.comments;
drop policy if exists "comments_delete_own" on public.comments;

drop policy if exists "comments_select_approved" on public.comments;
create policy "comments_select_approved"
  on public.comments for select
  to anon, authenticated
  using (is_approved = true);

drop policy if exists "comments_insert_anonymous" on public.comments;
create policy "comments_insert_anonymous"
  on public.comments for insert
  to anon, authenticated
  with check (
    user_id is null
    and is_approved = true
    and parent_id is null
  );

-- Force server-side timestamp on insert (ignore client-supplied created_at)
create or replace function public.comments_set_created_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.created_at := now();
  new.is_approved := true;
  new.user_id := null;
  return new;
end;
$$;

drop trigger if exists comments_before_insert on public.comments;
create trigger comments_before_insert
  before insert on public.comments
  for each row
  execute function public.comments_set_created_at();

-- Enable Realtime in Supabase Dashboard: Database → Replication → comments
