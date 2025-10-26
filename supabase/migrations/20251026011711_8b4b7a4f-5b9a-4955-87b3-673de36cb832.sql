-- Revoke all existing permissions first
REVOKE ALL ON TABLE public.registrations FROM anon;
REVOKE ALL ON TABLE public.registrations FROM authenticated;

-- Grant necessary permissions
GRANT SELECT, INSERT ON TABLE public.registrations TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.registrations_id_seq TO anon, authenticated;

-- Verify RLS is enabled
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Ensure the policy exists with correct configuration
DROP POLICY IF EXISTS "Allow all users to insert registrations" ON public.registrations;

CREATE POLICY "Allow all users to insert registrations"
ON public.registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);