
import { supabase } from '../../../supabase/client';

/**
 * Execute SQL directly with better error handling
 */
export const executeSql = async (sql: string): Promise<{ success: boolean; error?: string; details?: any }> => {
  try {
    console.log('Executing SQL:', sql);
    
    // No authentication required - RLS policies will handle access control
    
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
          
          // Try re-executing without re-authentication
          try {
            console.log('Retrying statement...');
            const { error: retryError } = await supabase.rpc('execute_sql', { 
              sql: stmt + ';' 
            });
            
            if (!retryError) {
              console.log('SQL executed successfully on retry');
              successCount++;
              continue;
            } else {
              console.error('Retry failed:', retryError);
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
