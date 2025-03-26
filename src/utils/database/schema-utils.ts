
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

// Generate SQL statements for missing columns
export const generateSchemaUpdateSQL = async (): Promise<string> => {
  try {
    // Get all columns from the registration table
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', REGISTRATIONS_TABLE);
      
    if (columnsError) {
      console.error('Error fetching table schema:', columnsError);
      return '';
    }
    
    // Get all column names in lowercase for case-insensitive comparison
    const columnNames = columns?.map(col => col.column_name.toLowerCase()) || [];
    
    // Get expected columns
    const expectedColumnsMap = getExpectedColumns();
    const expectedColumns = Object.keys(expectedColumnsMap).map(key => key.toLowerCase());
    
    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !columnNames.includes(col));
    
    if (missingColumns.length === 0) {
      return '-- No schema updates needed';
    }
    
    // Generate SQL for missing columns
    let sql = `-- Run this SQL in your Supabase SQL Editor to update the '${REGISTRATIONS_TABLE}' table\n\n`;
    
    missingColumns.forEach(colName => {
      const colDefinition = expectedColumnsMap[colName];
      sql += `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition};\n`;
    });
    
    return sql;
  } catch (err) {
    console.error('Error generating schema update SQL:', err);
    return `-- Error generating schema update SQL: ${err}`;
  }
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
        return false;
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
          const sqlScript = await generateSchemaUpdateSQL();
          console.log('Generated SQL script:', sqlScript);
          
          toast({
            title: "Schema Update Required",
            description: "Please run the SQL script provided in the admin dashboard to update your database.",
            variant: "destructive",
          });
        }
      } else {
        console.error('Failed to add missing columns');
        const sqlScript = await generateSchemaUpdateSQL();
        console.log('Generated SQL script:', sqlScript);
        
        toast({
          title: "Schema Update Required",
          description: "Please run the SQL script provided in the admin dashboard to update your database schema.",
          variant: "destructive",
        });
      }
    }
  } catch (error) {
    console.error('Error in enhanced database initialization:', error);
  }
};

// Create a view or div element to display the SQL script
export const createSQLScriptElement = async (): Promise<HTMLElement> => {
  const sqlScript = await generateSchemaUpdateSQL();
  
  const container = document.createElement('div');
  container.className = 'bg-slate-800 text-white p-4 rounded-md mt-4 overflow-x-auto';
  
  const header = document.createElement('div');
  header.className = 'font-bold text-sm mb-2';
  header.textContent = 'SQL Script to Update Schema:';
  
  const pre = document.createElement('pre');
  pre.className = 'text-xs';
  pre.textContent = sqlScript;
  
  container.appendChild(header);
  container.appendChild(pre);
  
  return container;
};
