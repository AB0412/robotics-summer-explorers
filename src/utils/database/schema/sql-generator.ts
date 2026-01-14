import { supabase, REGISTRATIONS_TABLE } from '../../supabase/client';
import { getExpectedColumns } from './column-management';

// Generate SQL statements for missing columns
export const generateSchemaUpdateSQL = async (): Promise<string> => {
  try {
    console.log('Generating schema update SQL...');
    
    // Since we can't query pg_catalog or information_schema directly,
    // we generate SQL for all expected columns with IF NOT EXISTS
    
    let sql = `-- Run this SQL in your database to ensure all required columns exist\n\n`;
    
    // Get all the expected columns
    const expectedColumnsMap = getExpectedColumns();
    
    // Generate SQL for all expected columns
    Object.entries(expectedColumnsMap).forEach(([colName, colDefinition]) => {
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
