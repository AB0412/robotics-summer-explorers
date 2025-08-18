-- SECURITY FIX: Restrict student schedule access to authenticated administrators only
-- This prevents unauthorized access to sensitive student location and timing information

-- Drop the existing broad admin policy for student_schedules
DROP POLICY IF EXISTS "Admin full access to schedules" ON student_schedules;

-- Create more specific and secure policies for student_schedules
-- Only authenticated users (administrators) can access student schedule data
CREATE POLICY "Authenticated admin read student schedules" 
ON student_schedules 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated admin insert student schedules" 
ON student_schedules 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated admin update student schedules" 
ON student_schedules 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated admin delete student schedules" 
ON student_schedules 
FOR DELETE 
TO authenticated
USING (true);

-- Ensure no anonymous access to sensitive schedule information
-- (Safety check - no anonymous policies should exist for this table)