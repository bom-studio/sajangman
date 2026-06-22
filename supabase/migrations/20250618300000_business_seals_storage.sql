-- business-seals: 공급자 직인 이미지 Storage
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-seals',
  'business-seals',
  true,
  5242880,
  array['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "business_seals_select_own" on storage.objects;
drop policy if exists "business_seals_insert_own" on storage.objects;
drop policy if exists "business_seals_update_own" on storage.objects;
drop policy if exists "business_seals_delete_own" on storage.objects;

create policy "business_seals_select_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'business-seals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "business_seals_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'business-seals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "business_seals_update_own"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'business-seals'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'business-seals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "business_seals_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'business-seals'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
