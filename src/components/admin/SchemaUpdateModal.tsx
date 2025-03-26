
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';
import { getAllRegistrations } from '@/utils/database';

interface SchemaUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SchemaUpdateModal: React.FC<SchemaUpdateModalProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  const handleRefreshRegistrations = async () => {
    setIsRefreshing(true);
    try {
      const registrations = await getAllRegistrations();
      console.log('Manually refreshed registrations:', registrations);
      
      if (registrations.length > 0) {
        toast({
          title: "Success",
          description: `Found ${registrations.length} registrations in the database. Please reload the page to see them.`,
        });
      } else {
        toast({
          title: "No registrations found",
          description: "The database connection works, but no registrations were found.",
        });
      }
    } catch (error) {
      console.error('Error refreshing registrations:', error);
      toast({
        title: "Error",
        description: "Failed to refresh registrations. See console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Database Schema Update</DialogTitle>
          <DialogDescription>
            Run the following SQL script in your Supabase SQL Editor to update your database schema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
          <pre className="text-xs">
            {`-- SQL query to create the registrations table with all the required fields
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
DROP POLICY IF EXISTS "Allow service_role full access" ON registrations;

-- Create policy to allow anonymous users to insert data
CREATE POLICY "Enable insert for anon" ON registrations 
  FOR INSERT TO anon
  WITH CHECK (true);

-- Make sure API access works by adding a policy for service_role
CREATE POLICY "Allow service_role full access" ON registrations
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Also create a general insert policy without role restriction
CREATE POLICY "Allow anonymous insert" ON registrations 
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read all data (admin access)
CREATE POLICY "Allow authenticated read access" ON registrations 
  FOR SELECT TO authenticated 
  USING (true);

-- Create a policy for public read access for testing
CREATE POLICY "Allow public read access" ON registrations 
  FOR SELECT
  USING (true);`}
          </pre>
        </div>
        
        <DialogFooter className="flex items-center justify-between">
          <Button 
            onClick={handleRefreshRegistrations} 
            disabled={isRefreshing}
            variant="outline"
            className="mr-auto"
          >
            <RefreshCcw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
