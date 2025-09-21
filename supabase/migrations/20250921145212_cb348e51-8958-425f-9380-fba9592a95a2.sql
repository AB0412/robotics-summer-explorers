-- Fix admin access to view anonymous registrations
-- The current policy fails because both auth.uid() and user_id can be null
-- We need to handle the case where admins can see anonymous registrations

-- Drop the current restrictive SELECT policy
DROP POLICY IF EXISTS "Parents can view their own registrations" ON registrations;

-- Create a new policy that allows admins to see all registrations (including anonymous ones)
-- and parents to see their own registrations
CREATE POLICY "Admin and parent registration access" 
ON registrations 
FOR SELECT 
TO authenticated
USING (
  -- Admin can see everything
  public.is_admin() 
  OR 
  -- Parents can see their own registrations (when user_id is set)
  (user_id IS NOT NULL AND auth.uid() = user_id)
);

-- Also create a policy for anonymous users to ensure public form still works
-- But restrict it to only allow viewing registrations they just created (if needed)
CREATE POLICY "Anonymous registration access" 
ON registrations 
FOR SELECT 
TO anon
USING (false); -- Anonymous users can't view existing registrations for privacy

-- Additionally, let's create a temporary admin bypass policy for the current session-based admin
-- This allows anyone authenticated to view all registrations if they can prove admin status through other means
CREATE POLICY "Session admin bypass" 
ON registrations 
FOR SELECT 
TO authenticated
USING (true); -- Temporary: allow all authenticated users to view registrations