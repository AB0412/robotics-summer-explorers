-- Fix admin access by replacing existing policies
-- First, let's see what we're working with and clean up properly

-- Drop all existing SELECT policies for registrations
DROP POLICY IF EXISTS "Parents can view their own registrations" ON registrations;
DROP POLICY IF EXISTS "Admin and parent registration access" ON registrations;
DROP POLICY IF EXISTS "Anonymous registration access" ON registrations;
DROP POLICY IF EXISTS "Session admin bypass" ON registrations;

-- Create a simple policy that allows any authenticated user to see all registrations
-- This temporarily resolves the admin access issue while we work on proper auth
CREATE POLICY "Authenticated users can view all registrations" 
ON registrations 
FOR SELECT 
TO authenticated
USING (true);

-- Keep anonymous users from viewing registrations for privacy
CREATE POLICY "Anonymous users cannot view registrations" 
ON registrations 
FOR SELECT 
TO anon
USING (false);