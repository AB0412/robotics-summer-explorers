import { supabase, REGISTRATIONS_TABLE } from '@/integrations/supabase/client';

/**
 * Fetches column names and data types for a given table.
 * @param tableName The name of the table to fetch columns from.
 * @returns An array of objects containing column names and data types, or undefined if an error occurs.
 */
export const getTableColumns = async (tableName: string): Promise<{ column_name: string; data_type: string; }[] | undefined> => {
  try {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: tableName });
    
    if (error) {
      console.error(`Error fetching columns for table ${tableName}:`, error);
      return undefined;
    }
    
    return data;
  } catch (error) {
    console.error(`Error calling get_table_columns RPC:`, error);
    return undefined;
  }
};

/**
 * Compares the actual database schema with the expected schema.
 * @param expectedColumns An array of expected column names.
 * @returns An object containing the missing columns.
 */
export const compareSchema = async (expectedColumns: string[]): Promise<string[]> => {
  try {
    const columns = await getTableColumns(REGISTRATIONS_TABLE);
    
    if (!columns) {
      console.error('Could not retrieve table columns.');
      return expectedColumns; // Return expected columns as missing
    }
    
    const existingColumns = columns.map(col => col.column_name);
    
    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !existingColumns.includes(col));
    
    return missingColumns;
  } catch (error) {
    console.error('Error comparing schema:', error);
    return expectedColumns; // Return expected columns as missing
  }
};
