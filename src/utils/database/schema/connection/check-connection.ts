
import { supabase } from '../../../supabase/client';

/**
 * Check database connection and permissions
 */
export const checkDatabaseConnection = async (): Promise<{ 
  connected: boolean; 
  error?: string; 
  details?: any;
  permissions?: {
    read: boolean;
    write: boolean;
    execute: boolean;
  }
}> => {
  try {
    console.log('Checking database connection...');
    
    // Ensure we're authenticated
    const { data: authData } = await supabase.auth.getSession();
    if (!authData.session) {
      console.log('No active session, attempting to sign in anonymously...');
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        return {
          connected: false,
          error: `Authentication failed: ${signInError.message}`,
          details: signInError
        };
      }
    }
    
    // Check if we can connect to Supabase at all using our new heartbeat function
    const { data: healthData, error: healthError } = await supabase.rpc('heartbeat');
    
    if (healthError) {
      console.error('Supabase connection test failed:', healthError);
      return {
        connected: false,
        error: `Connection failed: ${healthError.message}`,
        details: healthError,
        permissions: {
          read: false,
          write: false,
          execute: false
        }
      };
    }
    
    console.log('Supabase connection successful, checking table permissions...');
    
    // Initialize permissions object
    const permissions = {
      read: false,
      write: false,
      execute: false
    };
    
    // Check read permissions
    const { data: readData, error: readError } = await supabase
      .from('registrations')
      .select('count')
      .limit(1);
      
    if (readError) {
      console.error('Read test failed:', readError);
    } else {
      console.log('Read test successful');
      permissions.read = true;
    }
    
    // Check write permissions using our new check_write_permission function
    const { data: writeData, error: writeError } = await supabase.rpc('check_write_permission');
    
    if (writeError) {
      console.error('Write test failed:', writeError);
    } else {
      console.log('Write test successful');
      permissions.write = !!writeData;
    }
    
    // Check SQL execution permissions
    const { error: execError } = await supabase.rpc('execute_sql', { 
      sql: 'SELECT 1;' 
    });
    
    if (execError) {
      console.error('Execute SQL test failed:', execError);
    } else {
      console.log('Execute SQL test successful');
      permissions.execute = true;
    }
    
    // If we can't read, that's the most critical permission issue
    if (!permissions.read) {
      return {
        connected: false,
        error: 'Database read permission denied. Please check your Row Level Security (RLS) policies.',
        details: readError,
        permissions
      };
    }
    
    return {
      connected: true,
      permissions
    };
  } catch (error) {
    console.error('Error checking database connection:', error);
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown database connection error',
      details: error,
      permissions: {
        read: false,
        write: false,
        execute: false
      }
    };
  }
};
