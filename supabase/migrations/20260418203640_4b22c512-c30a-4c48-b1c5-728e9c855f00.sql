-- Ensure public registration submissions are allowed for everyone
DROP POLICY IF EXISTS "Anyone can insert registrations" ON public.registrations;

CREATE POLICY "Anyone can insert registrations"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);