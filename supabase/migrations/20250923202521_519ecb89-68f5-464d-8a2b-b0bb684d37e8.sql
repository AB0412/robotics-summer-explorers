-- Fix critical security vulnerability: Restrict student_payments table access
-- Currently any authenticated user can read all payment information

-- Drop the overly permissive read policy
DROP POLICY IF EXISTS "Authenticated can read payments" ON student_payments;

-- Create proper restrictive policies
-- Only admins can read all payment records
CREATE POLICY "Admins can read all payments" ON student_payments
  FOR SELECT TO authenticated
  USING (is_admin());

-- Users can only read payments for their own registrations
CREATE POLICY "Users can read own payments" ON student_payments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM registrations 
      WHERE registrations.registrationid = student_payments.registration_id 
      AND registrations.user_id = auth.uid()
    )
  );