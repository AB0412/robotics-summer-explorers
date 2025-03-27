
import React, { useState, useEffect } from 'react';
import { validateDatabaseSchema } from '@/utils/database/schema/validation';
import { executeSql, checkDatabaseConnection } from '@/utils/database/schema/db-connection';
import { hasValidCredentials, supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { checkRLSPolicies, fixRLSPolicies } from '@/utils/supabase/rls-helpers';
import { useToast } from '@/hooks/use-toast';

export const useDatabaseCheck = () => {
  const { toast } = useToast();
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunningPermissionCheck, setIsRunningPermissionCheck] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);

  useEffect(() => {
    // Check database schema when component loads
    checkDatabaseSchema();
  }, []);

  const checkDatabaseSchema = async () => {
    if (!hasValidCredentials()) {
      setDatabaseStatus('invalid');
      setErrorMessage('No valid Supabase credentials found for database schema validation');
      console.log('No valid Supabase credentials found for database schema validation');
      return;
    }

    try {
      console.log('Validating database schema...');
      setDatabaseStatus('checking');
      
      // Try to sign in anonymously if needed
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        console.log('No active session, attempting to sign in anonymously...');
        const { error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) {
          console.error('Anonymous sign-in failed:', signInError);
          setErrorMessage(`Authentication error: ${signInError.message}`);
          setDatabaseStatus('invalid');
          return;
        }
      }
      
      // Test connection first
      const connectionResult = await checkDatabaseConnection();
      setConnectionDetails(connectionResult);
      console.log('Connection test results:', connectionResult);
      
      if (!connectionResult.connected) {
        setDatabaseStatus('invalid');
        setErrorMessage(`Database connection failed: ${connectionResult.error}. ${connectionResult.permissions?.read === false ? 'Read permission denied.' : ''}`);
        return;
      }
      
      // Check RLS policies
      const rlsCheck = await checkRLSPolicies();
      if (!rlsCheck.success) {
        setErrorMessage(`RLS policy issue: ${rlsCheck.message}`);
        setDatabaseStatus('invalid');
        return;
      }
      
      // Try a direct table access
      const { error: tableError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('count')
        .limit(1);
          
      if (tableError) {
        console.error('Database table access error:', tableError);
        setErrorMessage(`Database permission error: ${tableError.message}`);
        setDatabaseStatus('invalid');
        return;
      }
      
      const isValid = await validateDatabaseSchema();
      console.log('Database schema validation result:', isValid);
      setDatabaseStatus(isValid ? 'valid' : 'invalid');
      
      if (!isValid) {
        setErrorMessage('Database schema validation failed. Please check console logs for details.');
      } else {
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Error checking database schema:', error);
      setDatabaseStatus('invalid');
      setErrorMessage(`Error checking database: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleFixPermissions = async () => {
    setIsRunningPermissionCheck(true);
    try {
      // Try to fix RLS policies first
      const rlsResult = await fixRLSPolicies();
      if (rlsResult.success) {
        setErrorMessage('RLS policies fixed successfully! Checking database access...');
        
        // Recheck database access
        const { error: retryError } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('count')
          .limit(1);
          
        if (!retryError) {
          setDatabaseStatus('valid');
          setErrorMessage(null);
          
          // Recheck connection details
          const connectionResult = await checkDatabaseConnection();
          setConnectionDetails(connectionResult);
        } else {
          setErrorMessage(`Fixed RLS but still having issues: ${retryError.message}`);
        }
        
        return;
      }
      
      // If RLS fix didn't work, try SQL execution
      const sqlScript = `
        -- Fix Row Level Security (RLS) policies
        DROP POLICY IF EXISTS "Allow anonymous to view all registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anonymous to insert registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anonymous to update registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anonymous to delete registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anyone to view all registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anyone to insert registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anyone to update registrations" ON registrations;
        DROP POLICY IF EXISTS "Allow anyone to delete registrations" ON registrations;
        
        -- Create public access policies
        CREATE POLICY "Allow anyone to view all registrations" 
        ON registrations 
        FOR SELECT 
        USING (true);
        
        CREATE POLICY "Allow anyone to insert registrations" 
        ON registrations 
        FOR INSERT 
        WITH CHECK (true);
        
        CREATE POLICY "Allow anyone to update registrations" 
        ON registrations 
        FOR UPDATE 
        USING (true);
        
        CREATE POLICY "Allow anyone to delete registrations" 
        ON registrations 
        FOR DELETE 
        USING (true);
      `;
      
      const { success, error, details } = await executeSql(sqlScript);
      
      if (success) {
        setErrorMessage('Permissions fixed successfully! Please try again.');
        // Recheck database access
        const { error: retryError } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('count')
          .limit(1);
          
        if (!retryError) {
          setDatabaseStatus('valid');
          
          // Recheck connection details
          const connectionResult = await checkDatabaseConnection();
          setConnectionDetails(connectionResult);
        }
      } else {
        console.error('SQL execution details:', details);
        setErrorMessage(`Failed to fix permissions: ${error}`);
      }
    } catch (error) {
      console.error('Error fixing permissions:', error);
      setErrorMessage(`Error fixing permissions: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsRunningPermissionCheck(false);
    }
  };

  return {
    databaseStatus,
    errorMessage,
    isRunningPermissionCheck,
    connectionDetails,
    checkDatabaseSchema,
    handleFixPermissions
  };
};

export default useDatabaseCheck;
