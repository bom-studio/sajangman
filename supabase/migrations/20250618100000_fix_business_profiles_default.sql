-- 기본 공급자 unique 제약 (사용자당 is_default=true 1개)
drop index if exists business_profiles_user_id_default_idx;

create unique index if not exists business_profiles_user_id_default_unique_idx
  on public.business_profiles (user_id)
  where is_default = true;

-- 기본 공급자 1개 제한 + 첫 공급자 자동 기본 설정
create or replace function public.enforce_single_default_business_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    if not exists (
      select 1
      from public.business_profiles
      where user_id = new.user_id
    ) then
      new.is_default := true;
    end if;
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
  before insert or update of is_default on public.business_profiles
  for each row
  execute function public.enforce_single_default_business_profile();

-- 기본 공급자 삭제 시 남은 공급자 중 최신 등록분을 기본으로 승격
create or replace function public.promote_default_business_profile_after_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  next_default_id uuid;
begin
  if old.is_default = false then
    return old;
  end if;

  select id
  into next_default_id
  from public.business_profiles
  where user_id = old.user_id
  order by created_at desc
  limit 1;

  if next_default_id is not null then
    update public.business_profiles
    set is_default = true
    where id = next_default_id
      and user_id = old.user_id;
  end if;

  return old;
end;
$$;

drop trigger if exists business_profiles_promote_default_after_delete on public.business_profiles;

create trigger business_profiles_promote_default_after_delete
  after delete on public.business_profiles
  for each row
  execute function public.promote_default_business_profile_after_delete();
