
import { supabase, REGISTRATIONS_TABLE } from '../../supabase/client';

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
      .rpc('get_table_columns', { table_name: REGISTRATIONS_TABLE })
      .select('column_name');
      
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
