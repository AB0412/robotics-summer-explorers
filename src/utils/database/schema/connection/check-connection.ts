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
    
    // Initialize permissions object
    const permissions = {
      read: false,
      write: false,
      execute: false
    };
    
    // Check read permissions by selecting from registrations
    const { data: readData, error: readError } = await supabase
      .from('registrations')
      .select('count')
      .limit(1);
      
    if (readError) {
      console.error('Read test failed:', readError);
      return {
        connected: false,
        error: `Database read permission denied: ${readError.message}`,
        details: readError,
        permissions
      };
    } else {
      console.log('Read test successful');
      permissions.read = true;
    }
    
    // For write and execute permissions, we'll assume they're available
    // if read works and user is authenticated
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      permissions.write = true;
      permissions.execute = true;
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
