import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { supabase, REGISTRATIONS_TABLE } from '@/integrations/supabase/client';

// Function to fetch column names and types for a given table
const getTableColumns = async (tableName: string): Promise<{ column_name: string; data_type: string }[]> => {
  try {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: tableName });
    if (error) {
      console.error('Error fetching table columns:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching table columns:', error);
    return [];
  }
};

// Function to check if a column exists in a table
const doesColumnExist = async (tableName: string, columnName: string): Promise<boolean> => {
  const columns = await getTableColumns(tableName);
  return columns.some(column => column.column_name === columnName);
};

// Function to check if a column has a specific data type
const checkColumnType = async (tableName: string, columnName: string, expectedType: string): Promise<boolean> => {
  const columns = await getTableColumns(tableName);
  const column = columns.find(col => col.column_name === columnName);
  return column ? column.data_type === expectedType : false;
};

// Function to execute a SQL command
const executeSQL = async (sql: string): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { sql });
    if (error) {
      console.error('Error executing SQL:', error);
      return { error: error.message };
    }
    return { data };
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { error: error instanceof Error ? error.message : String(error) };
  }
};

// Function to validate the database schema
export const validateDatabaseSchema = async (): Promise<boolean> => {
  try {
    // Check if the registrations table exists
    const { data: tableExists, error: tableError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
      
    if (tableError) {
      console.error(`Error checking if table ${REGISTRATIONS_TABLE} exists:`, tableError);
      return false;
    }
    
    if (!tableExists) {
      console.error(`Table ${REGISTRATIONS_TABLE} does not exist.`);
      return false;
    }
    
    // List of required columns with their data types
    const requiredColumns = [
      { name: 'registrationid', type: 'text' },
      { name: 'parentname', type: 'text' },
      { name: 'parentemail', type: 'text' },
      { name: 'parentphone', type: 'text' },
      { name: 'emergencycontact', type: 'text' },
      { name: 'childname', type: 'text' },
      { name: 'childage', type: 'text' },
      { name: 'childgrade', type: 'text' },
      { name: 'schoolname', type: 'text' },
      { name: 'preferredbatch', type: 'text' },
      { name: 'haspriorexperience', type: 'text' },
      { name: 'referralsource', type: 'text' },
      { name: 'photoconsent', type: 'boolean' },
      { name: 'waiveragreement', type: 'boolean' },
      { name: 'submittedat', type: 'text' },
      { name: 'alternatebatch', type: 'text' },
      { name: 'medicalinfo', type: 'text' },
      { name: 'experiencedescription', type: 'text' },
      { name: 'interestlevel', type: 'text' },
      { name: 'tshirtsize', type: 'text' },
      { name: 'specialrequests', type: 'text' },
      { name: 'volunteerinterest', type: 'boolean' }
    ];
    
    // Check if all required columns exist and have the correct data type
    for (const column of requiredColumns) {
      const columnExists = await doesColumnExist(REGISTRATIONS_TABLE, column.name);
      if (!columnExists) {
        console.error(`Column ${column.name} does not exist in table ${REGISTRATIONS_TABLE}.`);
        return false;
      }
      
      const correctType = await checkColumnType(REGISTRATIONS_TABLE, column.name, column.type);
      if (!correctType) {
        console.error(`Column ${column.name} has incorrect data type. Expected ${column.type}.`);
        return false;
      }
    }
    
    console.log('Database schema validation successful.');
    return true;
  } catch (error) {
    console.error('Error validating database schema:', error);
    return false;
  }
};
