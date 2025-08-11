-- Create receipts storage bucket (if not exists)
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

-- Add receipt_path column to student_payments to store uploaded receipt file path
alter table public.student_payments
add column if not exists receipt_path text;

-- Storage policies for receipts bucket
-- Allow selecting (reading) files from receipts bucket
create policy "Allow select on receipts"
  on storage.objects
  for select
  using (bucket_id = 'receipts');

-- Allow inserting (uploading) files into receipts bucket
create policy "Allow insert on receipts"
  on storage.objects
  for insert
  with check (bucket_id = 'receipts');

-- Allow updating files in receipts bucket
create policy "Allow update on receipts"
  on storage.objects
  for update
  using (bucket_id = 'receipts');

-- Allow deleting files in receipts bucket
create policy "Allow delete on receipts"
  on storage.objects
  for delete
  using (bucket_id = 'receipts');