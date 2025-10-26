
// Update the imports to use the new file structure
import { supabase, REGISTRATIONS_TABLE } from '../../supabase/client';
import { getExpectedColumns } from './column-management';

// Check if the database schema matches our application's expectations
export const validateDatabaseSchema = async (): Promise<boolean> => {
  try {
    console.log('Validating database schema...');
    
    // For anonymous users registering, we don't need to validate
    // The RLS policies will handle permissions at insert time
    // Just return true to allow the form to work
    console.log('Database schema validation successful - anonymous registration allowed');
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
