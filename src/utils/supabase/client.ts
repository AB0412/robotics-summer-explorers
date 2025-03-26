
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key from your Supabase project settings
export const supabaseUrl = 'YOUR_SUPABASE_URL';
export const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table name in Supabase
export const REGISTRATIONS_TABLE = 'registrations';

// Initialize the database (create tables if they don't exist)
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if the table exists by trying to select from it
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .limit(1);

    if (error) {
      console.error('Table might not exist, please create it in Supabase dashboard:', error);
      // We can't create tables from the client side with Supabase
      alert(`Please create a table named '${REGISTRATIONS_TABLE}' in your Supabase dashboard with the appropriate columns.`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};
