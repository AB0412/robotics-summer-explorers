-- Fix RLS policies for registrations to allow anonymous registration properly

-- Drop all existing policies for registrations table
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can insert their own registrations" ON registrations;
DROP POLICY IF EXISTS "Authenticated users can view all registrations" ON registrations;
DROP POLICY IF EXISTS "Anonymous users cannot view registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON registrations;
DROP POLICY IF EXISTS "Parents can update their own registrations" ON registrations;

-- Create simplified and working RLS policies for registrations
-- Allow anonymous users to insert registrations (for public registration form)
CREATE POLICY "Anonymous can insert registrations" ON registrations
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to insert registrations
CREATE POLICY "Authenticated can insert registrations" ON registrations
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Allow only authenticated users to read registrations (admin access)
CREATE POLICY "Authenticated can read all registrations" ON registrations
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update their own registrations or admins to update any
CREATE POLICY "Users can update own registrations or admins can update any" ON registrations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR is_admin())
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Allow only admins to delete registrations
CREATE POLICY "Admins can delete registrations" ON registrations
  FOR DELETE TO authenticated
  USING (is_admin());

-- Fix student_payments RLS to allow system operations
-- Drop existing policies
DROP POLICY IF EXISTS "Admin only read access to payments" ON student_payments;
DROP POLICY IF EXISTS "Admin only insert payments" ON student_payments;
DROP POLICY IF EXISTS "Admin only update payments" ON student_payments;
DROP POLICY IF EXISTS "Admin only delete payments" ON student_payments;

-- Create policies that allow system operations (triggers) to work
CREATE POLICY "System can insert payments" ON student_payments
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated can read payments" ON student_payments
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admins can update payments" ON student_payments
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete payments" ON student_payments
  FOR DELETE TO authenticated
  USING (is_admin());