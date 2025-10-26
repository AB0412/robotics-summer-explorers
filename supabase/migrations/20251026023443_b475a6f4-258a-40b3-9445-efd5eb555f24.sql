-- Grant INSERT permission to anonymous users at the table level
GRANT INSERT ON public.registrations TO anon;

-- Also grant SELECT to allow the .select() after insert
GRANT SELECT ON public.registrations TO anon;

-- Ensure the RLS policy is in place (idempotent)
DROP POLICY IF EXISTS "Enable all insertions" ON public.registrations;

CREATE POLICY "Enable all insertions"
ON public.registrations
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);