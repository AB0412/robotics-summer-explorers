-- Fix RLS policies for anonymous user registrations
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Anonymous can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated can insert registrations" ON registrations;
DROP POLICY IF EXISTS "Users can update own registrations or admins can update any" ON registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can read all registrations" ON registrations;
DROP POLICY IF EXISTS "Users can read own registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;
DROP POLICY IF EXISTS "Allow service_role full access" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;

-- Create new policies with correct permissions for anonymous registration

-- Allow anyone (anonymous or authenticated) to insert registrations
CREATE POLICY "Allow public insert registrations"
ON registrations
FOR INSERT
WITH CHECK (true);

-- Allow admins to read all registrations
CREATE POLICY "Admins can read all registrations"
ON registrations
FOR SELECT
USING (is_admin());

-- Allow users to read their own registrations (where user_id matches)
CREATE POLICY "Users can read own registrations"
ON registrations
FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins to update any registration
CREATE POLICY "Admins can update registrations"
ON registrations
FOR UPDATE
USING (is_admin())
WITH CHECK (is_admin());

-- Allow users to update their own registrations
CREATE POLICY "Users can update own registrations"
ON registrations
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow admins to delete registrations
CREATE POLICY "Admins can delete registrations"
ON registrations
FOR DELETE
USING (is_admin());