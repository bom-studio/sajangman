-- =============================================================================
-- Universal Board System for bomstudio-clients-db (Option 1)
-- Idempotent migration — NEW objects only (no ALTER/DROP on existing tables)
--
-- Access model:
--   - RLS enabled on all new tables
--   - NO anon/authenticated policies (browser cannot read/write directly)
--   - App servers use SUPABASE_SERVICE_ROLE_KEY and fix site_key/board_key
--   - toggle_board_post_vote: EXECUTE for service_role only
-- =============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1) boards
-- ---------------------------------------------------------------------------

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  site_key text not null,
  board_key text not null,
  name text not null,
  description text null,
  board_type text not null default 'general',
  settings jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint boards_site_key_len check (char_length(site_key) between 1 and 64),
  constraint boards_board_key_len check (char_length(board_key) between 1 and 64),
  constraint boards_site_board_unique unique (site_key, board_key)
);

create index if not exists boards_site_key_idx on public.boards (site_key);
create index if not exists boards_is_active_idx on public.boards (is_active);

-- ---------------------------------------------------------------------------
-- 2) board_posts
-- ---------------------------------------------------------------------------

create table if not exists public.board_posts (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.boards (id) on delete cascade,
  site_key text not null,

  title text not null,
  content text not null,

  status text not null default 'published',
  -- published | hidden | draft

  author_type text not null default 'visitor',
  -- visitor | admin | member
  author_id uuid null,
  visitor_id text null,
  nickname text null,

  is_pinned boolean not null default false,
  is_public boolean not null default true,

  view_count integer not null default 0,
  vote_count integer not null default 0,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint board_posts_title_len check (char_length(title) between 1 and 200),
  constraint board_posts_content_len check (char_length(content) between 1 and 10000),
  constraint board_posts_status_check check (status in ('published', 'hidden', 'draft')),
  constraint board_posts_author_type_check check (author_type in ('visitor', 'admin', 'member')),
  constraint board_posts_view_count_nonneg check (view_count >= 0),
  constraint board_posts_vote_count_nonneg check (vote_count >= 0),
  constraint board_posts_visitor_id_len check (
    visitor_id is null or char_length(visitor_id) between 8 and 80
  ),
  constraint board_posts_nickname_len check (
    nickname is null or char_length(nickname) between 1 and 40
  )
);

create index if not exists board_posts_board_created_idx
  on public.board_posts (board_id, created_at desc);

create index if not exists board_posts_board_votes_idx
  on public.board_posts (board_id, vote_count desc);

create index if not exists board_posts_site_board_idx
  on public.board_posts (site_key, board_id);

create index if not exists board_posts_public_list_idx
  on public.board_posts (board_id, is_public, status, created_at desc);

create index if not exists board_posts_visitor_created_idx
  on public.board_posts (visitor_id, created_at desc)
  where visitor_id is not null;

create index if not exists board_posts_metadata_gin_idx
  on public.board_posts using gin (metadata jsonb_path_ops);

-- ---------------------------------------------------------------------------
-- 3) board_post_votes
-- ---------------------------------------------------------------------------

create table if not exists public.board_post_votes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.board_posts (id) on delete cascade,
  visitor_id text not null,
  created_at timestamptz not null default now(),
  constraint board_post_votes_visitor_id_len check (
    char_length(visitor_id) between 8 and 80
  ),
  constraint board_post_votes_unique unique (post_id, visitor_id)
);

create index if not exists board_post_votes_visitor_idx
  on public.board_post_votes (visitor_id);

-- ---------------------------------------------------------------------------
-- 4) board_post_comments
-- ---------------------------------------------------------------------------

create table if not exists public.board_post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.board_posts (id) on delete cascade,
  parent_id uuid null references public.board_post_comments (id) on delete cascade,

  content text not null,

  author_type text not null default 'visitor',
  author_id uuid null,
  visitor_id text null,
  nickname text null,

  metadata jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint board_post_comments_content_len check (
    char_length(content) between 1 and 5000
  ),
  constraint board_post_comments_author_type_check check (
    author_type in ('visitor', 'admin', 'member')
  ),
  constraint board_post_comments_visitor_id_len check (
    visitor_id is null or char_length(visitor_id) between 8 and 80
  )
);

create index if not exists board_post_comments_post_created_idx
  on public.board_post_comments (post_id, created_at);

-- ---------------------------------------------------------------------------
-- Helpers / triggers
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists boards_set_updated_at on public.boards;
create trigger boards_set_updated_at
  before update on public.boards
  for each row
  execute function public.set_updated_at_timestamp();

drop trigger if exists board_posts_set_updated_at on public.board_posts;
create trigger board_posts_set_updated_at
  before update on public.board_posts
  for each row
  execute function public.set_updated_at_timestamp();

drop trigger if exists board_post_comments_set_updated_at on public.board_post_comments;
create trigger board_post_comments_set_updated_at
  before update on public.board_post_comments
  for each row
  execute function public.set_updated_at_timestamp();

-- Force site_key from boards; sanitize visitor inserts (incl. service_role visitor path)
create or replace function public.board_posts_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_board public.boards%rowtype;
  v_meta jsonb;
  v_role text := coalesce(auth.role(), 'anon');
  v_sanitize boolean := false;
begin
  select * into v_board
  from public.boards
  where id = new.board_id;

  if not found then
    raise exception 'board not found';
  end if;

  -- Always denormalize from board (never trust caller site_key)
  new.site_key := v_board.site_key;

  -- Sanitize visitor inserts only (not vote_count sync UPDATEs).
  -- Covers anon/authenticated (legacy) and service_role visitor posts.
  if tg_op = 'INSERT' then
    v_sanitize :=
      v_role in ('anon', 'authenticated')
      or new.visitor_id is not null;

    if v_sanitize then
      if not v_board.is_active then
        raise exception 'board is not active';
      end if;

      new.author_type := 'visitor';
      new.author_id := null;
      new.is_pinned := false;
      new.is_public := true;
      new.status := 'published';
      new.view_count := 0;
      new.vote_count := 0;

      if new.visitor_id is null
         or char_length(new.visitor_id) < 8
         or char_length(new.visitor_id) > 80 then
        raise exception 'invalid visitor_id';
      end if;

      v_meta := coalesce(new.metadata, '{}'::jsonb)
        - 'admin_note'
        - 'result_url'
        - 'request_status';

      if v_board.site_key = 'sajangman'
         and v_board.board_key = 'feature_requests' then
        v_meta := jsonb_set(v_meta, '{request_status}', '"requested"'::jsonb, true);
        v_meta := jsonb_set(v_meta, '{admin_note}', 'null'::jsonb, true);
        v_meta := jsonb_set(v_meta, '{result_url}', 'null'::jsonb, true);
      end if;

      new.metadata := v_meta;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists board_posts_before_write on public.board_posts;
create trigger board_posts_before_write
  before insert or update on public.board_posts
  for each row
  execute function public.board_posts_before_write();

-- Keep vote_count in sync
create or replace function public.sync_board_post_vote_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.board_posts
      set vote_count = vote_count + 1,
          updated_at = now()
      where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.board_posts
      set vote_count = greatest(vote_count - 1, 0),
          updated_at = now()
      where id = old.post_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists board_post_votes_sync_count on public.board_post_votes;
create trigger board_post_votes_sync_count
  after insert or delete on public.board_post_votes
  for each row
  execute function public.sync_board_post_vote_count();

-- ---------------------------------------------------------------------------
-- Vote RPC — server / service_role only (not callable with anon key)
-- ---------------------------------------------------------------------------

create or replace function public.toggle_board_post_vote(
  p_post_id uuid,
  p_visitor_id text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_post public.board_posts%rowtype;
  v_board public.boards%rowtype;
  v_existing_id uuid;
  v_voted boolean;
begin
  if p_post_id is null then
    raise exception 'post_id required';
  end if;

  if p_visitor_id is null
     or char_length(p_visitor_id) < 8
     or char_length(p_visitor_id) > 80
     or p_visitor_id !~ '^[A-Za-z0-9_-]+$' then
    raise exception 'invalid visitor_id';
  end if;

  select * into v_post
  from public.board_posts
  where id = p_post_id;

  if not found then
    raise exception 'post not found';
  end if;

  if v_post.is_public is not true then
    raise exception 'post is not public';
  end if;

  if v_post.status is distinct from 'published' then
    raise exception 'post is not published';
  end if;

  select * into v_board
  from public.boards
  where id = v_post.board_id;

  if not found or v_board.is_active is not true then
    raise exception 'board is not active';
  end if;

  select id into v_existing_id
  from public.board_post_votes
  where post_id = p_post_id
    and visitor_id = p_visitor_id;

  if v_existing_id is not null then
    delete from public.board_post_votes where id = v_existing_id;
    v_voted := false;
  else
    insert into public.board_post_votes (post_id, visitor_id)
    values (p_post_id, p_visitor_id);
    v_voted := true;
  end if;

  select vote_count into v_post.vote_count
  from public.board_posts
  where id = p_post_id;

  return jsonb_build_object(
    'voted', v_voted,
    'vote_count', coalesce(v_post.vote_count, 0)
  );
end;
$$;

-- Harden grants: no browser execute
revoke all on function public.toggle_board_post_vote(uuid, text) from public;
revoke all on function public.toggle_board_post_vote(uuid, text) from anon;
revoke all on function public.toggle_board_post_vote(uuid, text) from authenticated;
grant execute on function public.toggle_board_post_vote(uuid, text) to service_role;

-- ---------------------------------------------------------------------------
-- RLS (new tables only) — enable, but NO anon/authenticated policies
-- service_role bypasses RLS; all app access goes through Next.js server
-- ---------------------------------------------------------------------------

alter table public.boards enable row level security;
alter table public.board_posts enable row level security;
alter table public.board_post_votes enable row level security;
alter table public.board_post_comments enable row level security;

-- Idempotent cleanup if an older draft of this migration created public policies
drop policy if exists "boards_public_select_active" on public.boards;
drop policy if exists "board_posts_public_select" on public.board_posts;
drop policy if exists "board_posts_public_insert" on public.board_posts;
drop policy if exists "board_post_votes_public_select" on public.board_post_votes;
drop policy if exists "board_post_comments_public_select" on public.board_post_comments;

-- Intentionally no CREATE POLICY for anon/authenticated on these tables.

-- ---------------------------------------------------------------------------
-- Table privileges — service_role only (no anon/authenticated/public)
-- Some projects revoke default PUBLIC/service_role grants on new tables;
-- without these GRANTs PostgREST returns 42501 permission denied.
-- ---------------------------------------------------------------------------

grant usage on schema public to service_role;

grant select, insert, update, delete on table public.boards to service_role;
grant select, insert, update, delete on table public.board_posts to service_role;
grant select, insert, update, delete on table public.board_post_votes to service_role;
grant select, insert, update, delete on table public.board_post_comments to service_role;

-- ---------------------------------------------------------------------------
-- Seed: sajangman / feature_requests
-- ---------------------------------------------------------------------------

insert into public.boards (
  site_key,
  board_key,
  name,
  description,
  board_type,
  settings,
  is_active
)
values (
  'sajangman',
  'feature_requests',
  '기능 요청',
  '사장만에 필요한 기능을 요청하고 공감하는 게시판',
  'feature_request',
  jsonb_build_object(
    'allow_votes', true,
    'allow_visitor_posts', true,
    'categories', jsonb_build_array(
      'calculator', 'document', 'guide', 'sales', 'employee', 'other'
    )
  ),
  true
)
on conflict (site_key, board_key) do update
set
  name = excluded.name,
  description = excluded.description,
  board_type = excluded.board_type,
  settings = excluded.settings,
  is_active = true,
  updated_at = now();

-- =============================================================================
-- End of migration
-- =============================================================================
