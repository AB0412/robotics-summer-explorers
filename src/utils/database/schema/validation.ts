
// Update the imports to use the new file structure
import { supabase, REGISTRATIONS_TABLE } from '../../supabase/client';
import { getExpectedColumns } from './column-management';

// Check if the database schema matches our application's expectations
export const validateDatabaseSchema = async (): Promise<boolean> => {
  try {
    console.log('Validating database schema...');
    
    // First check if the table exists at all
    const { data: tableExists, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', REGISTRATIONS_TABLE)
      .eq('table_schema', 'public')
      .single();
      
    if (tableError || !tableExists) {
      console.error('Table does not exist:', tableError);
      return false;
    }
    
    // Get all columns from the registration table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', REGISTRATIONS_TABLE)
      .eq('table_schema', 'public');
      
    if (columnsError) {
      console.error('Error fetching table schema:', columnsError);
      return false;
    }
    
    if (!columns || columns.length === 0) {
      console.error('Table exists but has no columns');
      return false;
    }
    
    // Get all column names in lowercase for case-insensitive comparison
    const columnNames = columns.map(col => col.column_name.toLowerCase());
    console.log('Existing columns:', columnNames);
    
    // Check column data types and constraints
    console.log('Column details:', columns);
    
    // Define all the expected columns from our Registration type
    const expectedColumns = Object.keys(getExpectedColumns()).map(key => key.toLowerCase());
    console.log('Expected columns:', expectedColumns);
    
    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.error('Missing required columns:', missingColumns);
      return false;
    }
    
    // Check Row Level Security (RLS) policies
    console.log('Checking RLS policies...');
    try {
      const { data: policies, error: policiesError } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', REGISTRATIONS_TABLE);
        
      if (policiesError) {
        console.error('Error checking RLS policies:', policiesError);
      } else {
        console.log('Current RLS policies:', policies);
      }
    } catch (rlsError) {
      console.error('Failed to check RLS policies:', rlsError);
    }
    
    console.log('Database schema validation successful');
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
    
    // In a future update, we could improve this to actually create
    // or alter the table as needed based on the missing columns
    
    return false;
  } catch (error) {
    console.error('Error initializing database schema:', error);
    return false;
  }
};
