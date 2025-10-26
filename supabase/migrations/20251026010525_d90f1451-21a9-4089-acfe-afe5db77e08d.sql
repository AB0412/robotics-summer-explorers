-- Ensure anonymous users can insert registrations
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Allow public insert registrations" ON registrations;

-- Create a new policy that explicitly allows both anonymous and authenticated users to insert
CREATE POLICY "Allow all users to insert registrations"
ON registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Also grant INSERT permission to anon role on the table
GRANT INSERT ON registrations TO anon;
GRANT INSERT ON registrations TO authenticated;