-- Remove all existing policies on registrations table
DROP POLICY IF EXISTS "Users can read own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Users can update own registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Admins can read all registrations" ON public.registrations;
DROP POLICY IF EXISTS "Enable all insertions" ON public.registrations;

-- Create simple policies to allow registration
CREATE POLICY "Allow anyone to insert registrations"
ON public.registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anyone to read registrations"
ON public.registrations
FOR SELECT
USING (true);

CREATE POLICY "Allow anyone to update registrations"
ON public.registrations
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow anyone to delete registrations"
ON public.registrations
FOR DELETE
USING (true);