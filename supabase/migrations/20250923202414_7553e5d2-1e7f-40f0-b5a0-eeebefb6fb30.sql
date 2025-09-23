-- Fix critical security vulnerability: Restrict registrations table access
-- Currently any authenticated user can read all personal information

-- Drop the overly permissive read policy
DROP POLICY IF EXISTS "Authenticated can read all registrations" ON registrations;

-- Create proper restrictive policies
-- Only admins can read all registrations
CREATE POLICY "Admins can read all registrations" ON registrations
  FOR SELECT TO authenticated
  USING (is_admin());

-- Users can only read their own registrations
CREATE POLICY "Users can read own registrations" ON registrations
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Anonymous users cannot read any registrations
-- (This is implicit but making it clear for security audit)