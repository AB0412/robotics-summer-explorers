
import React, { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import { validateDatabaseSchema } from '@/utils/database/schema/validation';
import { hasValidCredentials, supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { executeSql, checkDatabaseConnection } from '@/utils/database/schema/db-connection'; 
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkRLSPolicies, fixRLSPolicies } from '@/utils/supabase/rls-helpers';

const Registration = () => {
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

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Summer Robotics Program Registration</h1>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        Please complete this form to register your child for our Summer Robotics Program. 
        All fields marked as required must be filled in to complete the registration.
      </p>
      
      {/* Database Connection Status */}
      {connectionDetails && (
        <Alert className={`mb-6 ${connectionDetails.connected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          {connectionDetails.connected ? 
            <CheckCircle2 className="h-4 w-4 text-green-700" /> : 
            <AlertTriangle className="h-4 w-4 text-yellow-700" />
          }
          <AlertDescription className={connectionDetails.connected ? 'text-green-700' : 'text-yellow-700'}>
            <div className="font-medium">
              {connectionDetails.connected ? 
                'Database Connection: Successful' : 
                'Database Connection: Failed'
              }
            </div>
            {connectionDetails.permissions && (
              <div className="mt-2">
                <div>Permissions:</div>
                <ul className="list-disc pl-5 mt-1">
                  <li>Read Access: {connectionDetails.permissions.read ? 'Yes ✓' : 'No ✗'}</li>
                  <li>Write Access: {connectionDetails.permissions.write ? 'Yes ✓' : 'No ✗'}</li>
                  <li>Execute SQL: {connectionDetails.permissions.execute ? 'Yes ✓' : 'No ✗'}</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-700" />
          <AlertDescription className="text-yellow-700 flex justify-between items-center">
            <span>{errorMessage}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFixPermissions}
              disabled={isRunningPermissionCheck}
              className="ml-4"
            >
              <Database className={`h-4 w-4 mr-2 ${isRunningPermissionCheck ? 'animate-spin' : ''}`} />
              {isRunningPermissionCheck ? 'Fixing...' : 'Fix Permissions'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <RegistrationForm />
    </div>
  );
};

export default Registration;
