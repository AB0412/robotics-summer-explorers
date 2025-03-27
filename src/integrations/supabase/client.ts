
// This file contains the Supabase client configuration
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://affmifojscdamiybxioe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZm1pZm9qc2NkYW1peWJ4aW9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwMjI1MDIsImV4cCI6MjA1ODU5ODUwMn0.nK_rXmi303lLdXf8p7je1SInOA5Ej9B18ITQ1ubrmnY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Add helper functions for authentication
export const hasValidCredentials = (): boolean => {
  return !(!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || 
    SUPABASE_URL.includes('placeholder') || 
    SUPABASE_PUBLISHABLE_KEY.includes('placeholder'));
};

// Table name in Supabase
export const REGISTRATIONS_TABLE = 'registrations';

// Initialize the database (ensure anonymous session is created)
export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!hasValidCredentials()) {
      console.warn('Using placeholder Supabase credentials. Please configure valid Supabase credentials.');
      return;
    }

    console.log('Initializing database connection...');
    
    // Ensure we have an anonymous session
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.log('No active session, attempting to sign in anonymously...');
      await supabase.auth.signInAnonymously();
      console.log('Anonymous sign-in initiated');
    } else {
      console.log('Session exists:', session.session.user?.id);
    }
    
    // Test database connection using the heartbeat function we just created
    const { data: connected, error: heartbeatError } = await supabase.rpc('heartbeat');
      
    if (heartbeatError) {
      console.error('Database connection error:', heartbeatError);
    } else {
      console.log('Successfully connected to Supabase database, heartbeat successful');
      
      // Test table access
      const { error: tableError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('count')
        .limit(1);
        
      if (tableError) {
        console.error('Table access error:', tableError);
      } else {
        console.log(`Successfully connected to ${REGISTRATIONS_TABLE} table`);
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Execute initializeDatabase when this module is imported
initializeDatabase().catch(console.error);
