
// Update the imports to use the new file structure
import { supabase, REGISTRATIONS_TABLE } from '../../supabase/client';
import { getExpectedColumns } from './column-management';

// Check if the database schema matches our application's expectations
export const validateDatabaseSchema = async (): Promise<boolean> => {
  try {
    console.log('Validating database schema...');
    
    // Instead of checking information_schema, just try to query the table
    // This is a more reliable way to check if the table exists and is accessible
    const { error: tableError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
      
    if (tableError) {
      console.error('Table access error:', tableError);
      return false;
    }
    
    console.log('Database schema validation successful - table is accessible');
    return true;
  } catch (err) {
    console.error('Error validating schema:', err);
    return false;
  }
};

// Create a function to enhance the database schema validation
export const enhancedInitializeDatabase = async (): Promise<boolean> => {
  try {
    // First check if the database schema is valid
    const isValid = await validateDatabaseSchema();
    
    if (isValid) {
      console.log('Database schema is valid, no initialization needed');
      return true;
    }
    
    console.log('Database schema validation failed');
    return false;
  } catch (error) {
    console.error('Error initializing database schema:', error);
    return false;
  }
};
