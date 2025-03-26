
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
    // First check if the execute_sql function exists
    const { data, error: rpcCheckError } = await supabase
      .rpc('execute_sql', { sql: 'SELECT 1;' });
    
    // If the function doesn't exist, create it
    if (rpcCheckError && rpcCheckError.message.includes('function "execute_sql" does not exist')) {
      console.log('Creating execute_sql function...');
      
      // Create the execute_sql function with proper permissions
      const createFuncSql = `
        CREATE OR REPLACE FUNCTION execute_sql(sql text)
        RETURNS void LANGUAGE plpgsql AS $$
        BEGIN
          EXECUTE sql;
        END;
        $$;
      `;
      
      // Execute the function creation directly
      const { error: createFuncError } = await supabase.rpc('exec_sql', { 
        sql: createFuncSql 
      });
      
      if (createFuncError) {
        console.error('Error creating execute_sql function:', createFuncError);
        return {
          success: false,
          error: `Could not create execute_sql function: ${createFuncError.message}`
        };
      }
    }
    
    // Now execute the actual SQL
    const { error } = await supabase.rpc('execute_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return {
        success: false,
        error: error.message
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
