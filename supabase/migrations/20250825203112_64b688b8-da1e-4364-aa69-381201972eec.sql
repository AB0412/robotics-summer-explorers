-- SECURITY FIX: Remove overly broad registration update policy
-- Current policy allows ANY authenticated user to modify ANY registration data

-- Drop the dangerous broad update policy
DROP POLICY IF EXISTS "Allow authenticated users to update registrations" ON registrations;

-- Verify we still have the correct restrictive policies in place
-- The "Parents can update their own registrations" policy should remain
-- which properly restricts updates to user_id = auth.uid() OR admin role

-- Let's also ensure the policies are properly defined by recreating them with explicit restrictions
DROP POLICY IF EXISTS "Parents can update their own registrations" ON registrations;

-- Recreate with proper user-specific restrictions
CREATE POLICY "Parents can update their own registrations" 
ON registrations 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Also ensure that INSERT policy properly sets user_id for new registrations
-- Drop any overly broad insert policies
DROP POLICY IF EXISTS "Allow anyone to insert registrations" ON registrations;

-- Ensure we have proper INSERT policies that link to the authenticated user
-- Keep the anonymous insert policies for public registration form
-- But add a policy for authenticated users that sets proper user_id
CREATE POLICY "Authenticated users can insert their own registrations" 
ON registrations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

-- Let's also verify all SELECT policies are properly restrictive
-- Make sure we don't have any overly broad SELECT policies
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;

-- The existing "Parents can view their own registrations" should be sufficient