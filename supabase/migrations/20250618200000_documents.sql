-- documents: 회원별 저장 문서
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  document_type text not null,
  document_number text,
  title text,
  customer_name text,
  total_amount numeric not null default 0,
  supplier_snapshot jsonb not null,
  customer_snapshot jsonb,
  document_data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists documents_user_id_idx
  on public.documents (user_id);

create index if not exists documents_user_type_idx
  on public.documents (user_id, document_type);

create index if not exists documents_created_at_idx
  on public.documents (created_at desc);

-- updated_at 자동 갱신
create or replace function public.set_documents_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists documents_updated_at on public.documents;

create trigger documents_updated_at
  before update on public.documents
  for each row
  execute function public.set_documents_updated_at();

-- RLS
alter table public.documents enable row level security;

drop policy if exists "documents_select_own" on public.documents;
drop policy if exists "documents_insert_own" on public.documents;
drop policy if exists "documents_update_own" on public.documents;
drop policy if exists "documents_delete_own" on public.documents;

create policy "documents_select_own"
  on public.documents
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "documents_insert_own"
  on public.documents
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "documents_update_own"
  on public.documents
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "documents_delete_own"
  on public.documents
  for delete
  to authenticated
  using (auth.uid() = user_id);
