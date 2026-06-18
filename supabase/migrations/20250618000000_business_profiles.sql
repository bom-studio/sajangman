-- business_profiles: 회원별 공급자(사업자) 정보
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  company_name text not null,
  representative_name text,
  business_number text,
  phone text,
  email text,
  address text,
  seal_url text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists business_profiles_user_id_idx
  on public.business_profiles (user_id);

create index if not exists business_profiles_user_id_default_idx
  on public.business_profiles (user_id)
  where is_default = true;

-- updated_at 자동 갱신
create or replace function public.set_business_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists business_profiles_updated_at on public.business_profiles;

create trigger business_profiles_updated_at
  before update on public.business_profiles
  for each row
  execute function public.set_business_profiles_updated_at();

-- 기본 공급자 1개 제한 + 첫 공급자 자동 기본 설정
create or replace function public.enforce_single_default_business_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.business_profiles
    where user_id = new.user_id
      and id is distinct from new.id
  ) then
    new.is_default := true;
  end if;

  if new.is_default = true then
    update public.business_profiles
    set is_default = false
    where user_id = new.user_id
      and id is distinct from new.id
      and is_default = true;
  end if;

  return new;
end;
$$;

drop trigger if exists business_profiles_single_default on public.business_profiles;

create trigger business_profiles_single_default
  before insert or update on public.business_profiles
  for each row
  execute function public.enforce_single_default_business_profile();

-- RLS
alter table public.business_profiles enable row level security;

drop policy if exists "business_profiles_select_own" on public.business_profiles;
drop policy if exists "business_profiles_insert_own" on public.business_profiles;
drop policy if exists "business_profiles_update_own" on public.business_profiles;
drop policy if exists "business_profiles_delete_own" on public.business_profiles;

create policy "business_profiles_select_own"
  on public.business_profiles
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "business_profiles_insert_own"
  on public.business_profiles
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "business_profiles_update_own"
  on public.business_profiles
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "business_profiles_delete_own"
  on public.business_profiles
  for delete
  to authenticated
  using (auth.uid() = user_id);
