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
import { RefreshCcw, Database, Copy, Play } from 'lucide-react';
import { getAllRegistrations, supabase, REGISTRATIONS_TABLE } from '@/utils/database';
import { executeSql } from '@/utils/database/schema/connection/execute-sql';

interface SchemaUpdateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefreshData?: () => Promise<void>;
}

export const SchemaUpdateModal: React.FC<SchemaUpdateModalProps> = ({ 
  open, 
  onOpenChange,
  onRefreshData
}) => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [isCopying, setIsCopying] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  
  const sqlScript = `-- SQL query to create/update the registrations table with all required fields
-- Run this in the Supabase SQL Editor

-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow authenticated read access" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anon" ON registrations;
DROP POLICY IF EXISTS "Allow service_role full access" ON registrations;
DROP POLICY IF EXISTS "Allow public read access" ON registrations;

-- We don't drop the table to preserve existing data
-- If you want to start fresh, uncomment this:
-- DROP TABLE IF EXISTS registrations;

-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS registrations (
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

-- IMPORTANT: Create these policies in order

-- Policy for service_role (full access) - most important one
CREATE POLICY "Allow service_role full access" ON registrations
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated users to have full access
CREATE POLICY "Allow authenticated full access" ON registrations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy to allow inserts from anonymous users
CREATE POLICY "Enable insert for anon" ON registrations 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Policy to allow select for everyone (public read access for testing)
CREATE POLICY "Allow public read access" ON registrations 
  FOR SELECT
  TO anon
  USING (true);

-- Reset ownership and grants
ALTER TABLE registrations OWNER TO authenticated;
GRANT ALL ON registrations TO service_role;
GRANT ALL ON registrations TO authenticated;
GRANT SELECT, INSERT ON registrations TO anon;
GRANT USAGE, SELECT ON SEQUENCE registrations_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE registrations_id_seq TO service_role;

-- Make sure RLS is turned OFF when using service_role
ALTER TABLE registrations FORCE ROW LEVEL SECURITY;
`;

  const handleRefreshRegistrations = async () => {
    setIsRefreshing(true);
    try {
      // First, ensure we're authenticated
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        console.log('No active session, attempting to sign in...');
        await supabase.auth.signInAnonymously();
      }
      
      // Directly query the database
      const { data: directData, error: directError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*');
      
      if (directError) {
        console.error('Direct query error:', directError);
        toast({
          title: "Error",
          description: `Database error: ${directError.message}. Try running the SQL script.`,
          variant: "destructive",
        });
      } else if (directData) {
        console.log('Direct query results:', directData);
        toast({
          title: "Success",
          description: `Found ${directData.length} registrations in the database.`,
        });
        
        // Call the onRefreshData callback if provided
        if (onRefreshData) {
          await onRefreshData();
        }
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
  
  const handleRunScript = async () => {
    setIsRunning(true);
    try {
      toast({
        title: "Running SQL Script",
        description: "This may take a moment...",
      });
      
      // First authenticate if needed
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        console.log('No active session, attempting to sign in...');
        await supabase.auth.signInAnonymously();
      }
      
      // Execute each SQL statement separately, skipping comments and empty lines
      const statements = sqlScript
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt && !stmt.startsWith('--'));
      
      let successCount = 0;
      let errorCount = 0;
      
      for (const stmt of statements) {
        if (!stmt) continue;
        
        console.log('Executing SQL:', stmt);
        const { success, error } = await executeSql(stmt + ';');
        
        if (success) {
          successCount++;
        } else {
          console.error('SQL execution error:', error);
          errorCount++;
          // Continue with other statements even if one fails
        }
      }
      
      toast({
        title: "SQL Script Complete",
        description: `${successCount} operations succeeded, ${errorCount} failed. Refreshing data...`,
      });
      
      // Refresh data after script execution
      await handleRefreshRegistrations();
      
    } catch (error) {
      console.error('Error running SQL script:', error);
      toast({
        title: "Script Execution Failed",
        description: "Failed to run SQL script. Please copy and run it manually in the Supabase SQL Editor.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
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
            This SQL script fixes Row Level Security policies and ensures the correct table structure.
            You can run it directly from here or copy it to run in your Supabase SQL Editor.
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative">
          <div className="absolute right-2 top-2 z-10 flex gap-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleCopyScript}
            >
              <Copy className={`h-4 w-4 mr-2 ${isCopying ? 'text-green-500' : ''}`} />
              {isCopying ? 'Copied!' : 'Copy'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleRunScript}
              disabled={isRunning}
            >
              <Play className={`h-4 w-4 mr-2 ${isRunning ? 'text-green-500' : ''}`} />
              {isRunning ? 'Running...' : 'Run Script'}
            </Button>
          </div>
          
          <div className="bg-gray-100 p-4 rounded-md overflow-auto max-h-[400px] mt-10">
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
