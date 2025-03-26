
// Re-export from the refactored modules for backward compatibility
export * from './schema/validation';
export * from './schema/ui-helpers';
export * from './schema/sql-generator';
export * from './schema/index';

// Import core functionality
import { supabase } from '../supabase/client';
import { validateDatabaseSchema, enhancedInitializeDatabase } from './schema/validation';

// Create a helper function to execute SQL directly
export const executeSql = async (sql: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Executing SQL:', sql);
    
    // Try direct query first with service_role permissions if possible
    const { error: directError } = await supabase.rpc('execute_sql', { 
      sql: sql 
    });
    
    if (!directError) {
      console.log('SQL executed successfully via RPC');
      return { success: true };
    }
    
    console.error('Error executing SQL via RPC:', directError);
    
    // Fallback: Try to execute with raw query if RPC fails
    try {
      const { error: rawError } = await supabase.from('_test_sql_execution')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      // If this is a table not found error, we can try creating our exec_sql function
      if (rawError && rawError.code === '42P01') {
        console.log('Creating exec_sql function as fallback...');
        
        // Create admin-level function for SQL execution
        const createExecSql = `
          CREATE OR REPLACE FUNCTION exec_sql(sql text) 
          RETURNS void AS $$
          BEGIN
            EXECUTE sql;
          END;
          $$ LANGUAGE plpgsql SECURITY DEFINER;
        `;
        
        // Execute the function creation directly
        const { error: createFuncError } = await supabase.rpc('exec_sql', { 
          sql: createExecSql 
        });
        
        if (createFuncError) {
          console.error('Error creating exec_sql function:', createFuncError);
          
          // Final attempt: try using a direct SQL query through the API
          const { error: apiError } = await supabase.auth.signInAnonymously();
          if (!apiError) {
            // Execute original SQL now that we're authenticated
            const { error: finalError } = await supabase.rpc('execute_sql', { 
              sql: sql 
            });
            
            if (!finalError) {
              console.log('SQL executed successfully after authentication');
              return { success: true };
            } else {
              console.error('Final attempt error:', finalError);
              return {
                success: false,
                error: `Could not execute SQL: ${finalError.message}`
              };
            }
          }
        } else {
          // Now try to execute the original SQL using our new function
          const { error: execError } = await supabase.rpc('exec_sql', { 
            sql: sql 
          });
          
          if (!execError) {
            console.log('SQL executed successfully via exec_sql function');
            return { success: true };
          } else {
            console.error('Error executing SQL via exec_sql:', execError);
            return {
              success: false,
              error: `Could not execute SQL: ${execError.message}`
            };
          }
        }
      }
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
    
    return {
      success: false,
      error: directError.message
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
