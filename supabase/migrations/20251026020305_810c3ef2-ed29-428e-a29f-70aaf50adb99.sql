-- The issue is that the policy targets "public" role but Supabase uses "anon" role
-- Drop the existing policy
DROP POLICY IF EXISTS "Public registration insert" ON public.registrations;

-- Create a policy that explicitly targets the anon role (for unauthenticated users)
CREATE POLICY "Allow anonymous registrations"
ON public.registrations
FOR INSERT
TO anon
WITH CHECK (true);

-- Also allow authenticated users to register
CREATE POLICY "Allow authenticated registrations"
ON public.registrations
FOR INSERT
TO authenticated
WITH CHECK (true);