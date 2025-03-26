
import { supabase, REGISTRATIONS_TABLE } from '../supabase/client';
import { Registration } from './types';
import { toast } from '@/hooks/use-toast';

// Check if the database schema matches our application's expectations
export const validateDatabaseSchema = async (): Promise<boolean> => {
  try {
    console.log('Validating database schema...');
    
    // Get all columns from the registration table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', REGISTRATIONS_TABLE);
      
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
    
    // Define all the expected columns from our Registration type
    const expectedColumns = Object.keys(getExpectedColumns()).map(key => key.toLowerCase());
    console.log('Expected columns:', expectedColumns);
    
    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length > 0) {
      console.error('Missing required columns:', missingColumns);
      return false;
    }
    
    console.log('Database schema validation successful');
    return true;
  } catch (err) {
    console.error('Error validating schema:', err);
    return false;
  }
};

// Get a map of expected columns with their SQL definition
export const getExpectedColumns = (): Record<string, string> => {
  return {
    id: 'SERIAL PRIMARY KEY',
    registrationid: 'TEXT UNIQUE NOT NULL',
    parentname: 'TEXT NOT NULL',
    parentemail: 'TEXT NOT NULL',
    parentphone: 'TEXT NOT NULL',
    emergencycontact: 'TEXT NOT NULL',
    childname: 'TEXT NOT NULL',
    childage: 'TEXT NOT NULL',
    childgrade: 'TEXT NOT NULL',
    schoolname: 'TEXT NOT NULL',
    medicalinfo: 'TEXT',
    preferredbatch: 'TEXT NOT NULL',
    alternatebatch: 'TEXT',
    haspriorexperience: 'TEXT NOT NULL',
    experiencedescription: 'TEXT',
    interestlevel: 'TEXT',
    referralsource: 'TEXT NOT NULL',
    photoconsent: 'BOOLEAN NOT NULL DEFAULT FALSE',
    waiveragreement: 'BOOLEAN NOT NULL DEFAULT FALSE',
    tshirtsize: 'TEXT',
    specialrequests: 'TEXT',
    volunteerinterest: 'BOOLEAN NOT NULL DEFAULT FALSE',
    submittedat: 'TEXT NOT NULL'
  };
};

// Add missing columns to the table
export const addMissingColumns = async (): Promise<boolean> => {
  try {
    console.log('Checking for missing columns to add...');
    
    // Get all columns from the registration table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', REGISTRATIONS_TABLE);
      
    if (columnsError) {
      console.error('Error fetching table schema:', columnsError);
      return false;
    }
    
    // Get all column names in lowercase for case-insensitive comparison
    const columnNames = columns?.map(col => col.column_name.toLowerCase()) || [];
    
    // Get expected columns
    const expectedColumnsMap = getExpectedColumns();
    const expectedColumns = Object.keys(expectedColumnsMap).map(key => key.toLowerCase());
    
    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length === 0) {
      console.log('No missing columns to add');
      return true;
    }
    
    console.log('Missing columns to add:', missingColumns);
    
    // Add each missing column
    for (const colName of missingColumns) {
      const colDefinition = expectedColumnsMap[colName];
      
      if (!colDefinition) {
        console.error(`Definition missing for column: ${colName}`);
        continue;
      }
      
      console.log(`Adding column ${colName} with definition: ${colDefinition}`);
      
      const { error } = await supabase.rpc('execute_sql', { 
        sql: `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition}` 
      });
      
      if (error) {
        console.error(`Error adding column ${colName}:`, error);
        
        // Try direct SQL if RPC fails (may depend on permissions)
        const { error: directError } = await supabase.from('migrations').insert([
          { name: `add_column_${colName}`, sql: `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition}` }
        ]);
        
        if (directError) {
          console.error(`Error with direct SQL for column ${colName}:`, directError);
          return false;
        }
      }
    }
    
    console.log('All missing columns added successfully');
    return true;
  } catch (err) {
    console.error('Error adding missing columns:', err);
    return false;
  }
};

// Update initialization in the client.ts file to include our new validation
export const enhancedInitializeDatabase = async (): Promise<void> => {
  try {
    console.log('Enhanced database initialization...');
    const isSchemaValid = await validateDatabaseSchema();
    
    if (!isSchemaValid) {
      console.log('Schema validation failed, attempting to add missing columns...');
      const columnsAdded = await addMissingColumns();
      
      if (columnsAdded) {
        // Validate schema again after adding columns
        const revalidated = await validateDatabaseSchema();
        if (revalidated) {
          console.log('Schema successfully updated and validated');
          toast({
            title: "Database Schema Updated",
            description: "Missing columns were added to the database schema.",
          });
        } else {
          console.error('Schema still invalid after adding columns');
          toast({
            title: "Schema Update Issue",
            description: "Could not fully update the database schema. Check console for details.",
            variant: "destructive",
          });
        }
      } else {
        console.error('Failed to add missing columns');
        toast({
          title: "Schema Update Failed",
          description: "Could not add missing columns to the database. You may need to run the SQL script manually.",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Error in enhanced database initialization:', error);
  }
};
