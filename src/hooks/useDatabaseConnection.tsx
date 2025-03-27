
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { hasValidCredentials, initializeDatabase, supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { checkDatabaseConnection } from '@/utils/database/schema/db-connection';

export const useDatabaseConnection = () => {
  const { toast } = useToast();
  const [databaseReady, setDatabaseReady] = React.useState<boolean | null>(null);
  const [databaseError, setDatabaseError] = React.useState<string | null>(null);
  const [isCheckingDatabase, setIsCheckingDatabase] = React.useState(false);
  const [connectionDetails, setConnectionDetails] = React.useState<any>(null);
  const [initialCheckDone, setInitialCheckDone] = React.useState(false);

  // Initialize database connection
  React.useEffect(() => {
    if (!initialCheckDone) {
      checkDatabase();
    }
  }, [initialCheckDone]);

  const checkDatabase = async () => {
    setIsCheckingDatabase(true);
    try {
      console.log('Starting database check...');
      
      // Ensure authentication
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        console.log('No active session, attempting to sign in anonymously...');
        await supabase.auth.signInAnonymously();
      }
      
      // Initialize the database
      await initializeDatabase();
      
      // Check database connection
      const connectionResult = await checkDatabaseConnection();
      setConnectionDetails(connectionResult);
      
      console.log('Connection check result:', connectionResult);
      
      if (!connectionResult.connected) {
        console.error('Database connection failed:', connectionResult.error);
        setDatabaseReady(false);
        setDatabaseError(`Database connection error: ${connectionResult.error || 'Unknown error'}. ${connectionResult.permissions?.read === false ? 'Read permission denied. Please check your Row Level Security (RLS) policies.' : ''}`);
        
        // Only show toast during initial load
        if (!initialCheckDone) {
          toast({
            title: "Database Connection Issue",
            description: `Unable to connect to the database. Please check your Supabase project settings.`,
            variant: "destructive",
          });
        }
        
        setInitialCheckDone(true);
        return;
      }
      
      // Test if table exists and is accessible
      const { error } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('count')
        .limit(1);
        
      if (error) {
        console.error('Database check failed:', error);
        setDatabaseReady(false);
        setDatabaseError(`Database permission error: ${error.message || 'Unknown error'}. Please check your Row Level Security (RLS) policies.`);
        
        // Only show toast during initial load
        if (!initialCheckDone) {
          toast({
            title: "Database Permission Issue",
            description: `Please ensure the ${REGISTRATIONS_TABLE} table has proper RLS policies in your Supabase project.`,
            variant: "destructive",
          });
        }
      } else {
        console.log('Database connection successful');
        setDatabaseReady(true);
        setDatabaseError(null);
        
        // Only show toast during initial load
        if (!initialCheckDone) {
          toast({
            title: "Database Connection Successful",
            description: "Successfully connected to the Supabase database.",
          });
        }
      }
      
      setInitialCheckDone(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setDatabaseReady(false);
      setDatabaseError(error instanceof Error ? error.message : 'Unknown database error');
      setInitialCheckDone(true);
    } finally {
      setIsCheckingDatabase(false);
    }
  };

  return {
    databaseReady,
    databaseError,
    isCheckingDatabase,
    connectionDetails,
    checkDatabase,
    initialCheckDone
  };
};
