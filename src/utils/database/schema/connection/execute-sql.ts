import { supabase } from '@/integrations/supabase/client';

/**
 * Executes a raw SQL query against the Supabase database.
 * @param {string} sql - The SQL query to execute.
 * @returns {Promise<any>} - The result of the query.
 */
export const executeSQL = async (sql: string): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      throw new Error(`SQL execution failed: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
};
