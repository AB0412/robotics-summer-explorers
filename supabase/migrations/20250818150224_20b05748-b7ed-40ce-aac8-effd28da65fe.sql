-- SECURITY FIX: Remove dangerous public access policies for registrations table
-- This prevents unauthorized access to children's personal information

-- Drop all overly permissive policies that allow public access to sensitive data
DROP POLICY IF EXISTS "Allow anyone to view all registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anyone to delete registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anyone to update registrations" ON registrations;

-- Keep anonymous insert policies (needed for public registration form)
-- These policies already exist: "Allow anonymous insert" and "Enable insert for anon"

-- Ensure authenticated admin access remains (this policy should already exist)
-- "Allow authenticated read access" policy already exists

-- Add secure authenticated-only policies for update and delete operations
CREATE POLICY "Allow authenticated users to update registrations" 
ON registrations 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete registrations" 
ON registrations 
FOR DELETE 
TO authenticated
USING (true);