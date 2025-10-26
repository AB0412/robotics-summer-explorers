-- Drop all existing INSERT policies to start fresh
DROP POLICY IF EXISTS "Allow all users to insert registrations" ON public.registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.registrations;
DROP POLICY IF EXISTS "Allow anonymous insert" ON public.registrations;

-- Create a comprehensive INSERT policy that allows anyone to insert
CREATE POLICY "Public registration insert"
ON public.registrations
FOR INSERT
WITH CHECK (true);

-- Make sure RLS is enabled
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Force RLS for the table owner as well (this can sometimes help with policy application)
ALTER TABLE public.registrations FORCE ROW LEVEL SECURITY;