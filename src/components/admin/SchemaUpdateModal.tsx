
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
import { RefreshCcw, Database, Copy } from 'lucide-react';
import { getAllRegistrations, supabase, REGISTRATIONS_TABLE } from '@/utils/database';

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
  const [isCopying, setIsCopying] = React.useState(false);
  
  const sqlScript = `-- SQL query to create/update the registrations table with all required fields
-- Run this in the Supabase SQL Editor

-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;
DROP POLICY IF EXISTS "Allow service_role full access" ON registrations;
DROP POLICY IF EXISTS "Allow public read access" ON registrations;

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

-- Policy for service_role (full access) - most important one
CREATE POLICY "Allow service_role full access" ON registrations
  FOR ALL 
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Policy to allow inserts from anonymous users
CREATE POLICY "Enable insert for anon" ON registrations 
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Policy to allow select for everyone (public read access for testing)
-- You can restrict this later for better security
CREATE POLICY "Allow public read access" ON registrations 
  FOR SELECT
  USING (true);

-- Policy to allow all actions from authenticated users 
CREATE POLICY "Allow authenticated full access" ON registrations 
  FOR ALL 
  TO authenticated
  USING (true) 
  WITH CHECK (true);
`;

  const handleRefreshRegistrations = async () => {
    setIsRefreshing(true);
    try {
      // First, attempt to authenticate
      await supabase.auth.signInAnonymously();
      
      // Try a direct database query
      const { data: directData, error: directError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*');
      
      if (directError) {
        console.error('Direct query error:', directError);
        
        // Try getting registrations through our utility
        const registrations = await getAllRegistrations();
        
        if (registrations && registrations.length > 0) {
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
      } else if (directData) {
        console.log('Direct query results:', directData);
        toast({
          title: "Success",
          description: `Found ${directData.length} registrations in the database. Please reload the page to see them.`,
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

  const handleCopyScript = () => {
    setIsCopying(true);
    try {
      navigator.clipboard.writeText(sqlScript);
      toast({
        title: "Copied",
        description: "SQL script copied to clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy script:', error);
      toast({
        title: "Error",
        description: "Failed to copy SQL script to clipboard.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Schema & RLS Update
          </DialogTitle>
          <DialogDescription>
            Run the following SQL script in your Supabase SQL Editor to fix Row Level Security policies and ensure the correct table structure.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <Button 
            size="sm" 
            variant="outline" 
            className="absolute right-2 top-2 z-10"
            onClick={handleCopyScript}
          >
            <Copy className={`h-4 w-4 mr-2 ${isCopying ? 'text-green-500' : ''}`} />
            {isCopying ? 'Copied!' : 'Copy'}
          </Button>
          
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px]">
            <pre className="text-xs whitespace-pre-wrap">
              {sqlScript}
            </pre>
          </div>
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
