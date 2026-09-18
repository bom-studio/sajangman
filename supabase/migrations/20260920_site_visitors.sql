-- =============================================================================
-- Universal site visitors (multi-tenant via site_key)
-- Date: 2026-09-20
--
-- Shared by sajangman / bomstudio / client sites on bomstudio-clients-db.
-- Do NOT create per-site tables (e.g. sajangman_visitors).
--
-- Security:
--   - RLS enabled, NO anon/authenticated policies
--   - service_role: SELECT, INSERT, UPDATE only (no DELETE)
--   - Does not modify boards / shop / members tables
--
-- Run manually in Supabase SQL Editor.
-- =============================================================================

create table if not exists public.site_visitors (
  id uuid primary key default gen_random_uuid(),
  site_key text not null,
  visitor_id text not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  visit_count integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint site_visitors_site_key_len check (char_length(site_key) between 1 and 64),
  constraint site_visitors_visitor_id_len check (char_length(visitor_id) between 8 and 80),
  constraint site_visitors_visit_count_nonneg check (visit_count >= 1),
  constraint site_visitors_site_visitor_unique unique (site_key, visitor_id)
);

create index if not exists site_visitors_site_key_idx
  on public.site_visitors (site_key);

create index if not exists site_visitors_site_first_seen_idx
  on public.site_visitors (site_key, first_seen_at);

create index if not exists site_visitors_site_last_seen_idx
  on public.site_visitors (site_key, last_seen_at);

-- Reuse shared updated_at helper if present (from boards migration);
-- otherwise create a minimal one for this table only.
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

drop trigger if exists site_visitors_set_updated_at on public.site_visitors;
create trigger site_visitors_set_updated_at
  before update on public.site_visitors
  for each row
  execute function public.set_updated_at_timestamp();

alter table public.site_visitors enable row level security;

-- Intentionally no CREATE POLICY for anon / authenticated.

grant usage on schema public to service_role;

grant select, insert, update
  on table public.site_visitors
  to service_role;

-- =============================================================================
-- End of migration
-- =============================================================================
