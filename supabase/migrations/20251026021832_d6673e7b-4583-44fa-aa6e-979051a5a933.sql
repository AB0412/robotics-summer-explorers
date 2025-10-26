-- Drop all existing INSERT policies on registrations
DROP POLICY IF EXISTS "Allow anonymous registrations" ON public.registrations;
DROP POLICY IF EXISTS "Allow authenticated registrations" ON public.registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.registrations;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.registrations;

-- Create a single PERMISSIVE policy that allows all insertions
CREATE POLICY "Enable all insertions"
ON public.registrations
AS PERMISSIVE
FOR INSERT
WITH CHECK (true);