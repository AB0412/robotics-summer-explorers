// Re-export everything from the Lovable Cloud Supabase client
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Export the Lovable Cloud supabase client
export { supabase };

// Supabase URL and anon key from environment
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

// Check if Supabase credentials are valid
export const hasValidCredentials = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Table name in Supabase
export const REGISTRATIONS_TABLE = 'registrations';

// Import schema validation functions
import { validateDatabaseSchema, enhancedInitializeDatabase } from '../database/schema-utils';

// Initialize the database (create tables if they don't exist)
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if we have valid credentials before proceeding
    if (!hasValidCredentials()) {
      console.warn('Missing Supabase credentials. Please configure valid Supabase credentials.');
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
        description: `Please create a table named '${REGISTRATIONS_TABLE}' in your Supabase project.`,
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
