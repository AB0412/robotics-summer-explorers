-- SECURITY FIX: Restrict student_payments table access to admins only
-- Current policies allow ANY authenticated user to access sensitive financial data

-- First, create security definer functions to avoid infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT public.get_current_user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing overly permissive policies on student_payments
DROP POLICY IF EXISTS "Authenticated admin read access to payments" ON student_payments;
DROP POLICY IF EXISTS "Authenticated admin insert payments" ON student_payments;
DROP POLICY IF EXISTS "Authenticated admin update payments" ON student_payments;
DROP POLICY IF EXISTS "Authenticated admin delete payments" ON student_payments;

-- Create restrictive admin-only policies for student_payments
CREATE POLICY "Admin only read access to payments" 
ON student_payments 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admin only insert payments" 
ON student_payments 
FOR INSERT 
TO authenticated
WITH CHECK (public.is_admin());

CREATE POLICY "Admin only update payments" 
ON student_payments 
FOR UPDATE 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

CREATE POLICY "Admin only delete payments" 
ON student_payments 
FOR DELETE 
TO authenticated
USING (public.is_admin());

-- Fix infinite recursion in profiles table policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Also fix the registrations policies to use the security definer function
DROP POLICY IF EXISTS "Parents can view their own registrations" ON registrations;
DROP POLICY IF EXISTS "Parents can update their own registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON registrations;

CREATE POLICY "Parents can view their own registrations" 
ON registrations 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Parents can update their own registrations" 
ON registrations 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can delete registrations" 
ON registrations 
FOR DELETE 
TO authenticated
USING (public.is_admin());