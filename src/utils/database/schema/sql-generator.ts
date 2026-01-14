
import { supabase, REGISTRATIONS_TABLE } from '../../supabase/client';
import { getExpectedColumns } from './column-management';

// Generate SQL statements for missing columns
export const generateSchemaUpdateSQL = async (): Promise<string> => {
  try {
    console.log('Generating schema update SQL...');
    
    // First, check if our RPC function exists
    const { data: functions, error: functionsError } = await supabase
      .from('pg_catalog.pg_proc')
      .select('proname')
      .eq('proname', 'get_table_columns')
      .limit(1);
      
    // If the function doesn't exist, create it first
    if (functionsError || !functions || functions.length === 0) {
      console.log('Creating get_table_columns function...');
      // We need to include this in our SQL script
      let sql = `-- First, create a helper function to get table columns\n`;
      sql += `CREATE OR REPLACE FUNCTION get_table_columns(table_name text)\n`;
      sql += `RETURNS TABLE(column_name text, data_type text) LANGUAGE sql AS $$\n`;
      sql += `  SELECT column_name::text, data_type::text\n`;
      sql += `  FROM information_schema.columns\n`;
      sql += `  WHERE table_name = $1 AND table_schema = 'public'\n`;
      sql += `$$;\n\n`;
      
      // Now we need to include the actual table updates
      sql += `-- Now, let's add the missing columns\n`;
      
      // Get all the expected columns
      const expectedColumnsMap = getExpectedColumns();
      
      // Generate SQL for all expected columns
      Object.entries(expectedColumnsMap).forEach(([colName, colDefinition]) => {
        sql += `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition};\n`;
      });
      
      return sql;
    }
    
    // Use our custom function to get columns
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: REGISTRATIONS_TABLE })
      .select('column_name');
      
    if (columnsError) {
      console.error('Error fetching table schema:', columnsError);
      return `-- Error fetching table schema: ${columnsError.message}\n\n` +
             `-- Let's create a helper function first:\n` +
             `CREATE OR REPLACE FUNCTION get_table_columns(table_name text)\n` +
             `RETURNS TABLE(column_name text, data_type text) LANGUAGE sql AS $$\n` +
             `  SELECT column_name::text, data_type::text\n` +
             `  FROM information_schema.columns\n` +
             `  WHERE table_name = $1 AND table_schema = 'public'\n` +
             `$$;\n\n` +
             `-- Then run this function to check for columns:\n` +
             `SELECT * FROM get_table_columns('${REGISTRATIONS_TABLE}');\n\n` +
             `-- After that, run the ALTER TABLE commands below:\n\n` +
             Object.entries(getExpectedColumns()).map(([colName, colDefinition]) => 
               `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition};`
             ).join('\n');
    }
    
    if (!columns) {
      console.error('No columns data returned');
      return `-- Could not retrieve column information for table: ${REGISTRATIONS_TABLE}\n` +
             `-- Let's add all expected columns:\n\n` +
             Object.entries(getExpectedColumns()).map(([colName, colDefinition]) => 
               `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition};`
             ).join('\n');
    }
    
    console.log('Retrieved columns:', columns);
    
    // Get all column names in lowercase for case-insensitive comparison
    // Ensure columns is always treated as an array
    const columnsArray = Array.isArray(columns) ? columns : [columns];
    const columnNames = columnsArray.map(col => col.column_name.toLowerCase());
    
    // Get expected columns
    const expectedColumnsMap = getExpectedColumns();
    const expectedColumns = Object.keys(expectedColumnsMap).map(key => key.toLowerCase());
    
    // Find missing columns
    const missingColumns = expectedColumns.filter(col => !columnNames.includes(col));
    console.log('Missing columns:', missingColumns);
    
    if (missingColumns.length === 0) {
      return '-- No schema updates needed. All required columns exist.';
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
    return `-- Error generating schema update SQL: ${err}\n\n` + 
           `-- You can manually add missing columns with this SQL:\n\n` +
           Object.entries(getExpectedColumns()).map(([colName, colDefinition]) => 
             `ALTER TABLE ${REGISTRATIONS_TABLE} ADD COLUMN IF NOT EXISTS ${colName} ${colDefinition};`
           ).join('\n');
  }
};
