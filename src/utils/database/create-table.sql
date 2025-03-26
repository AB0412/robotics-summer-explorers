
-- SQL query to create the registrations table with all the required fields
-- You can run this in the Supabase SQL Editor

-- Drop the table if it exists (be careful with this in production!)
DROP TABLE IF EXISTS registrations;

-- Create the table with all fields from our registration form
CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  registrationId TEXT UNIQUE NOT NULL,
  parentName TEXT NOT NULL,
  parentEmail TEXT NOT NULL,
  parentPhone TEXT NOT NULL,
  emergencyContact TEXT NOT NULL,
  childName TEXT NOT NULL,
  childAge TEXT NOT NULL,
  childGrade TEXT NOT NULL,
  schoolName TEXT NOT NULL,
  medicalInfo TEXT,
  preferredBatch TEXT NOT NULL,
  alternateBatch TEXT,
  hasPriorExperience TEXT NOT NULL,
  experienceDescription TEXT,
  interestLevel TEXT,
  referralSource TEXT NOT NULL,
  photoConsent BOOLEAN NOT NULL DEFAULT FALSE,
  waiverAgreement BOOLEAN NOT NULL DEFAULT FALSE,
  tShirtSize TEXT,
  specialRequests TEXT,
  volunteerInterest BOOLEAN NOT NULL DEFAULT FALSE,
  submittedAt TEXT NOT NULL
);

-- Add row level security (RLS) policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to insert data
CREATE POLICY "Allow anonymous insert" ON registrations 
  FOR INSERT TO anon WITH CHECK (true);

-- Create policy to allow authenticated users to read all data (admin access)
CREATE POLICY "Allow authenticated read access" ON registrations 
  FOR SELECT TO authenticated USING (true);
