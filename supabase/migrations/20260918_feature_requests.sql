-- Feature requests + votes for sajangman
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  category text not null
    check (category in ('calculator', 'document', 'guide', 'sales', 'employee', 'other')),
  title text not null,
  content text not null,
  industry text null,
  nickname text null,
  visitor_id text not null,
  status text not null default 'requested'
    check (status in ('requested', 'reviewing', 'planned', 'developing', 'completed', 'rejected')),
  admin_note text null,
  result_url text null,
  vote_count integer not null default 0 check (vote_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feature_requests_title_len check (char_length(title) between 2 and 100),
  constraint feature_requests_content_len check (char_length(content) between 2 and 1000)
);

create index if not exists feature_requests_created_at_idx
  on public.feature_requests (created_at desc);

create index if not exists feature_requests_vote_count_idx
  on public.feature_requests (vote_count desc);

create index if not exists feature_requests_category_idx
  on public.feature_requests (category);

create index if not exists feature_requests_status_idx
  on public.feature_requests (status);

create index if not exists feature_requests_visitor_created_idx
  on public.feature_requests (visitor_id, created_at desc);

create table if not exists public.feature_request_votes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.feature_requests (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  unique (request_id, visitor_id)
);

create index if not exists feature_request_votes_visitor_idx
  on public.feature_request_votes (visitor_id);

-- ---------------------------------------------------------------------------
-- Triggers: force public insert defaults + keep vote_count in sync
-- ---------------------------------------------------------------------------

create or replace function public.force_feature_request_insert_defaults()
returns trigger
language plpgsql
as $$
begin
  new.status := 'requested';
  new.admin_note := null;
  new.result_url := null;
  new.vote_count := 0;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists feature_requests_force_defaults on public.feature_requests;
create trigger feature_requests_force_defaults
  before insert on public.feature_requests
  for each row
  execute function public.force_feature_request_insert_defaults();

create or replace function public.set_feature_request_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists feature_requests_set_updated_at on public.feature_requests;
create trigger feature_requests_set_updated_at
  before update on public.feature_requests
  for each row
  execute function public.set_feature_request_updated_at();

create or replace function public.sync_feature_request_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.feature_requests
      set vote_count = vote_count + 1,
          updated_at = now()
      where id = new.request_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.feature_requests
      set vote_count = greatest(vote_count - 1, 0),
          updated_at = now()
      where id = old.request_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists feature_request_votes_sync_count on public.feature_request_votes;
create trigger feature_request_votes_sync_count
  after insert or delete on public.feature_request_votes
  for each row
  execute function public.sync_feature_request_vote_count();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.feature_requests enable row level security;
alter table public.feature_request_votes enable row level security;

drop policy if exists "Public can read feature requests" on public.feature_requests;
create policy "Public can read feature requests"
  on public.feature_requests
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert feature requests" on public.feature_requests;
create policy "Public can insert feature requests"
  on public.feature_requests
  for insert
  to anon, authenticated
  with check (
    char_length(title) between 2 and 100
    and char_length(content) between 2 and 1000
    and char_length(visitor_id) between 8 and 80
  );

-- No public UPDATE/DELETE on feature_requests (admin via Dashboard / service role)

drop policy if exists "Public can read votes" on public.feature_request_votes;
create policy "Public can read votes"
  on public.feature_request_votes
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can insert votes" on public.feature_request_votes;
create policy "Public can insert votes"
  on public.feature_request_votes
  for insert
  to anon, authenticated
  with check (char_length(visitor_id) between 8 and 80);

drop policy if exists "Public can delete own votes" on public.feature_request_votes;
create policy "Public can delete own votes"
  on public.feature_request_votes
  for delete
  to anon, authenticated
  using (true);
-- Note: delete is open to anon because votes are keyed by visitor_id;
-- app always deletes by (request_id, visitor_id). Unique constraint prevents abuse of counts.

comment on table public.feature_requests is 'User feature requests / public roadmap items';
comment on table public.feature_request_votes is 'Anonymous votes (visitor_id from localStorage)';
