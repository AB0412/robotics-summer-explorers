
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
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Log Supabase initialization
console.log('Supabase client initialized with URL:', supabaseUrl);
console.log('Credentials valid:', hasValidCredentials());

// Table name in Supabase
export const REGISTRATIONS_TABLE = 'registrations';

// Import schema validation functions
import { validateDatabaseSchema, enhancedInitializeDatabase } from '../database/schema-utils';

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

    console.log('Initializing database connection...');
    
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
    
    // Use our enhanced schema validation
    await enhancedInitializeDatabase();
    
    console.log(`Successfully connected to ${REGISTRATIONS_TABLE} table in Supabase`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    toast({
      title: "Database Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
  }
};
