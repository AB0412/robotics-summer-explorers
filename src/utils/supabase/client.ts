
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Update the Supabase URL with the correct project URL
export const supabaseUrl = 'https://affmifojscdamiybxioe.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZm1pZm9qc2NkYW1peWJ4aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjI1MDIsImV4cCI6MjA1ODU5ODUwMn0.nK_rXmi303lLdXf8p7je1SInOA5Ej9B18ITQ1ubrmnY';

// Check if Supabase credentials are valid
export const hasValidCredentials = (): boolean => {
  // Check if keys are empty or contain placeholder text
  return !(!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder'));
}

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true
    }
  }
);

// Log Supabase initialization
console.log('Supabase client initialized with URL:', supabaseUrl);
console.log('Credentials valid:', hasValidCredentials());

// Table name in Supabase
export const REGISTRATIONS_TABLE = 'registrations';

// Check if the table has the required schema
const validateTableSchema = async (): Promise<boolean> => {
  try {
    // Try to get the table definition using system tables
    const { data, error } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', REGISTRATIONS_TABLE);
      
    if (error) {
      console.error('Error checking table schema:', error);
      return false;
    }
    
    if (!data || data.length === 0) {
      console.error('Table exists but has no columns');
      return false;
    }
    
    // Check for essential columns
    const requiredColumns = [
      'registrationid', 'parentname', 'parentemail', 'childname', 
      'childage', 'preferredbatch', 'haspriorexperience'
    ];
    
    const columnNames = data.map(col => col.column_name.toLowerCase());
    
    const missingColumns = requiredColumns.filter(
      col => !columnNames.includes(col)
    );
    
    if (missingColumns.length > 0) {
      console.error('Missing required columns:', missingColumns);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in schema validation:', err);
    return false;
  }
};

// Initialize the database (create tables if they don't exist)
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if we have valid credentials before proceeding
    if (!hasValidCredentials()) {
      console.warn('Using placeholder Supabase credentials. Please configure valid Supabase credentials to use the application.');
      toast({
        title: "Database Configuration Required",
        description: "Please configure valid Supabase credentials to use this application.",
        variant: "destructive",
      });
      return;
    }

    // Check if the table exists by trying to select from it
    const { error: tableCheckError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);

    if (tableCheckError) {
      console.error('Table check error - table might not exist:', tableCheckError);
      toast({
        title: "Database Table Missing",
        description: `Please create a table named '${REGISTRATIONS_TABLE}' in your Supabase project. Use the SQL script provided in the documentation.`,
        variant: "destructive",
      });
      return;
    }
    
    // Validate table schema
    const isSchemaValid = await validateTableSchema();
    
    if (!isSchemaValid) {
      toast({
        title: "Table Schema Issue",
        description: `The '${REGISTRATIONS_TABLE}' table exists but doesn't have all required columns. Please update your table schema according to the documentation.`,
        variant: "destructive",
      });
      return;
    }
    
    console.log(`Successfully connected to ${REGISTRATIONS_TABLE} table in Supabase with valid schema`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    toast({
      title: "Database Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
  }
};
