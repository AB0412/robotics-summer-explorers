-- Replace receipts bucket policies to require authenticated users

-- Drop existing permissive policies
drop policy if exists "Allow select on receipts" on storage.objects;
drop policy if exists "Allow insert on receipts" on storage.objects;
drop policy if exists "Allow update on receipts" on storage.objects;
drop policy if exists "Allow delete on receipts" on storage.objects;

-- Create stricter policies limited to authenticated role
create policy "Receipts select (authenticated)"
  on storage.objects
  for select
  using (
    bucket_id = 'receipts' and auth.role() = 'authenticated'
  );

create policy "Receipts insert (authenticated)"
  on storage.objects
  for insert
  with check (
    bucket_id = 'receipts' and auth.role() = 'authenticated'
  );

create policy "Receipts update (authenticated)"
  on storage.objects
  for update
  using (
    bucket_id = 'receipts' and auth.role() = 'authenticated'
  );

create policy "Receipts delete (authenticated)"
  on storage.objects
  for delete
  using (
    bucket_id = 'receipts' and auth.role() = 'authenticated'
  );