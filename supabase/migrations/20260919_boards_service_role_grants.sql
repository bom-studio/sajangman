-- =============================================================================
-- boards privilege fix — service_role GRANTs only
-- Date: 2026-09-19
--
-- Problem:
--   PostgREST returns 42501 "permission denied for table boards"
--   with hint: GRANT SELECT ON public.boards TO service_role;
--
-- Cause:
--   This project does not auto-grant new public tables to service_role.
--   20260919_universal_boards.sql never REVOKE'd table privileges from
--   service_role; it also never GRANT'd them. RLS is unrelated (BYPASSRLS).
--
-- Scope:
--   ONLY the four boards* tables. Do not touch shop/orders/payments/members.
--   Do NOT grant to anon/authenticated/public.
--
-- Run manually in Supabase SQL Editor (do not auto-apply from app).
-- =============================================================================

grant usage on schema public to service_role;

grant select, insert, update, delete
  on table public.boards
  to service_role;

grant select, insert, update, delete
  on table public.board_posts
  to service_role;

grant select, insert, update, delete
  on table public.board_post_votes
  to service_role;

grant select, insert, update, delete
  on table public.board_post_comments
  to service_role;

-- Vote RPC already granted in 20260919; keep idempotent
grant execute on function public.toggle_board_post_vote(uuid, text) to service_role;

-- Optional verification (safe; no secrets):
-- select grantee, table_name, privilege_type
-- from information_schema.role_table_grants
-- where table_schema = 'public'
--   and table_name in ('boards', 'board_posts', 'board_post_votes', 'board_post_comments')
--   and grantee = 'service_role'
-- order by table_name, privilege_type;
