
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

-- Create policy to allow anonymous users to insert data
CREATE POLICY "Allow anonymous insert" ON registrations 
  FOR INSERT TO anon WITH CHECK (true);

-- Create policy to allow authenticated users to read all data (admin access)
CREATE POLICY "Allow authenticated read access" ON registrations 
  FOR SELECT TO authenticated USING (true);

-- Create helper function to get table columns 
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
