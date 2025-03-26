
// Re-export from the refactored modules for backward compatibility
export * from './schema/validation';
export * from './schema/ui-helpers';
export * from './schema/sql-generator';
export * from './schema/index';

// Import core functionality
import { supabase } from '../supabase/client';
import { validateDatabaseSchema, enhancedInitializeDatabase } from './schema/validation';

// Create a helper function to execute SQL directly with better error handling
export const executeSql = async (sql: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Executing SQL:', sql);
    
    // First make sure we're authenticated
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.log('No active session, attempting to sign in anonymously...');
      await supabase.auth.signInAnonymously();
    }
    
    // Split the script into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--'));
    
    let successCount = 0;
    let errorCount = 0;
    let lastError = '';
    
    for (const stmt of statements) {
      try {
        // Execute each statement individually for better error isolation
        const { error } = await supabase.rpc('execute_sql', { sql: stmt + ';' });
        
        if (error) {
          console.error('SQL execution error:', error);
          errorCount++;
          lastError = error.message;
          
          // Try direct query as fallback
          try {
            // For DDL statements that modify the schema, we need special permissions
            // Try using service_role client if available
            const { error: directError } = await supabase.auth.signInAnonymously();
            if (!directError) {
              // Retry with new auth
              const { error: retryError } = await supabase.rpc('execute_sql', { 
                sql: stmt + ';' 
              });
              
              if (!retryError) {
                console.log('SQL executed successfully after re-authentication');
                successCount++;
                lastError = '';
                continue;
              }
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
      }
    }
    
    if (errorCount > 0) {
      return {
        success: false,
        error: `${errorCount} SQL statements failed. Last error: ${lastError}`
      };
    }
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error executing SQL'
    };
  }
};

// Re-export the validation functions
export { validateDatabaseSchema, enhancedInitializeDatabase };
