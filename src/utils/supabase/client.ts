
import { createClient } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

// Replace these with your actual Supabase URL and anon key from your Supabase project settings
export const supabaseUrl = 'https://placeholder.supabase.co';
export const supabaseAnonKey = 'placeholder-anon-key';

// Create Supabase client with error handling
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Table name in Supabase
export const REGISTRATIONS_TABLE = 'registrations';

// Check if Supabase credentials are valid
export const hasValidCredentials = (): boolean => {
  return !(supabaseUrl === 'https://placeholder.supabase.co' || 
           supabaseAnonKey === 'placeholder-anon-key' ||
           !supabaseUrl || !supabaseAnonKey);
}

// Initialize the database (create tables if they don't exist)
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if we have valid credentials before proceeding
    if (!hasValidCredentials()) {
      console.warn('Using placeholder Supabase credentials. Database operations will fall back to local storage.');
      return;
    }

    // Check if the table exists by trying to select from it
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .limit(1);

    if (error) {
      console.error('Table might not exist, please create it in Supabase dashboard:', error);
      // We can't create tables from the client side with Supabase
      console.warn(`Please create a table named '${REGISTRATIONS_TABLE}' in your Supabase dashboard with the appropriate columns.`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
