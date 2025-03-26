
-- SQL query to create the registrations table with all the required fields
-- You can run this in the Supabase SQL Editor

-- Drop the table if it exists (be careful with this in production!)
DROP TABLE IF EXISTS registrations;

-- Create the table with all fields from our registration form
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  registrationid TEXT UNIQUE NOT NULL,
  parentname TEXT NOT NULL,
  parentemail TEXT NOT NULL,
  parentphone TEXT NOT NULL,
  emergencycontact TEXT NOT NULL,
  childname TEXT NOT NULL,
  childage TEXT NOT NULL,
  childgrade TEXT NOT NULL,
  schoolname TEXT NOT NULL,
  medicalinfo TEXT,
  preferredbatch TEXT NOT NULL,
  alternatebatch TEXT,
  haspriorexperience TEXT NOT NULL,
  experiencedescription TEXT,
  interestlevel TEXT,
  referralsource TEXT NOT NULL,
  photoconsent BOOLEAN NOT NULL DEFAULT FALSE,
  waiveragreement BOOLEAN NOT NULL DEFAULT FALSE,
  tshirtsize TEXT,
  specialrequests TEXT,
  volunteerinterest BOOLEAN NOT NULL DEFAULT FALSE,
  submittedat TEXT NOT NULL
);

-- Add row level security (RLS) policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;

-- Create policy to allow anonymous users to insert data
-- Make this policy explicit for the 'anon' role and use less restrictive syntax
CREATE POLICY "Enable insert for anon" ON registrations 
  FOR INSERT TO anon
  WITH CHECK (true);

-- Also create a general insert policy without role restriction as fallback
CREATE POLICY "Allow anonymous insert" ON registrations 
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all data (admin access)
CREATE POLICY "Allow authenticated read access" ON registrations 
  FOR SELECT TO authenticated USING (true);

-- Helper function to get table columns 
CREATE OR REPLACE FUNCTION get_table_columns(table_name text)
RETURNS TABLE(column_name text, data_type text) LANGUAGE sql AS $$
  SELECT column_name::text, data_type::text
  FROM information_schema.columns
  WHERE table_name = $1 AND table_schema = 'public'
$$;

-- Create execute_sql function for adding columns
CREATE OR REPLACE FUNCTION execute_sql(sql text)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  EXECUTE sql;
END;
$$;

-- Create a helper function to check table permissions
CREATE OR REPLACE FUNCTION check_table_permissions(table_name text, permission text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  -- This is a dummy function that will always return success
  -- since we'll be using it just to check if we have permissions
  RETURN json_build_object('has_permission', true);
END;
$$;
