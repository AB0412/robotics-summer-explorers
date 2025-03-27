
// Re-export from the refactored modules for backward compatibility
export * from './schema/validation';
export * from './schema/ui-helpers';
export * from './schema/sql-generator';
export * from './schema/index';

// Import core functionality
import { supabase } from '../supabase/client';
import { validateDatabaseSchema, enhancedInitializeDatabase } from './schema/validation';

// Create a helper function to execute SQL directly with better error handling
export const executeSql = async (sql: string): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    console.log('Executing SQL:', sql);
    
    // First make sure we're authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.log('No active session, attempting to sign in anonymously...');
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        console.error('Anonymous sign-in failed:', signInError);
        return {
          success: false,
          error: `Authentication failed: ${signInError.message}`,
          details: signInError
        };
      }
      console.log('Anonymous sign-in successful');
    }
    
    // Debug: Check current authentication status
    const { data: currentSession } = await supabase.auth.getSession();
    console.log('Current session status:', currentSession.session ? 'Authenticated' : 'Not authenticated');
    
    // Split the script into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    let lastError = '';
    let lastErrorDetails = null;
    
    for (const stmt of statements) {
      try {
        console.log('Executing statement:', stmt);
        
        // Execute each statement individually for better error isolation
        const { error } = await supabase.rpc('execute_sql', { sql: stmt + ';' });
        
        if (error) {
          console.error('SQL execution error:', error);
          errorCount++;
          lastError = error.message;
          lastErrorDetails = error;
          
          // Test direct table access to diagnose permission issues
          console.log('Testing direct table access...');
          const { error: directAccessError } = await supabase
            .from('registrations')
            .select('count')
            .limit(1);
            
          if (directAccessError) {
            console.error('Direct table access failed:', directAccessError);
            console.log('This confirms a permissions issue with the database');
          } else {
            console.log('Direct table access succeeded, but RPC failed. This suggests an RPC permission issue.');
          }
          
          // Try direct query as fallback
          try {
            // For DDL statements that modify the schema, we need special permissions
            // Try using service_role client if available
            console.log('Attempting re-authentication...');
            const { error: reAuthError } = await supabase.auth.signInAnonymously();
            
            if (!reAuthError) {
              // Retry with new auth
              console.log('Re-authentication successful, retrying statement...');
              const { error: retryError } = await supabase.rpc('execute_sql', { 
                sql: stmt + ';' 
              });
              
              if (!retryError) {
                console.log('SQL executed successfully after re-authentication');
                successCount++;
                continue;
              } else {
                console.error('Retry failed after re-authentication:', retryError);
              }
            } else {
              console.error('Re-authentication failed:', reAuthError);
            }
          } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
          }
        } else {
          console.log('SQL statement executed successfully');
          successCount++;
        }
      } catch (stmtError) {
        console.error('Statement execution error:', stmtError);
        errorCount++;
        lastError = stmtError instanceof Error ? stmtError.message : String(stmtError);
        lastErrorDetails = stmtError;
      }
    }
    
    if (errorCount > 0) {
      return {
        success: false,
        error: `${errorCount} SQL statements failed. Last error: ${lastError}`,
        details: lastErrorDetails
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error executing SQL',
      details: error
    };
  }
};

// Add a function to explicitly check database connection
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

// Re-export the validation functions
export { validateDatabaseSchema, enhancedInitializeDatabase };
