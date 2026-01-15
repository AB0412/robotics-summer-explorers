import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../../supabase/client';
import { Registration } from '../types';

// Get all registrations
export const getAllRegistrations = async (): Promise<Registration[]> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot load registrations.');
    return [];
  }

  try {
    console.log('Attempting to get all registrations from Supabase...');
    
    // Add a console log to show the table name we're querying
    console.log(`Query table: ${REGISTRATIONS_TABLE}`);
    
    // First, try to get a count to see if we can access the table at all
    const { count, error: countError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error checking registrations count:', countError);
      console.log('Error details:', countError.details);
      console.log('Error hint:', countError.hint);
      console.log('Error code:', countError.code);
      
      // Check for specific RLS issues
      if (countError.code === 'PGRST301' || countError.message?.includes('policy')) {
        console.error('This appears to be a Row Level Security (RLS) policy issue.');
        console.log('Current authentication status:', supabase.auth.getSession());
      }
      
      return [];
    }
    
    console.log(`Table contains approximately ${count} records`);
    
    // Now get the actual data with more verbose error handling
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error getting registrations:', error);
      console.log('Error details:', error.details);
      console.log('Error hint:', error.hint);
      console.log('Error code:', error.code);
      
      // Check authentication and other potential issues
      if (error.code === '42501' || error.message?.includes('permission')) {
        console.error('Permission denied. This is likely an RLS policy issue.');
        
        // Verify if we're authenticated
        const { data: session } = await supabase.auth.getSession();
        console.log('Current session:', session);
        
        if (!session.session) {
          console.log('Not authenticated. This could be why RLS is blocking access.');
        }
      }
      
      return [];
    }
    
    // Log the retrieved data for debugging
    console.log(`Successfully retrieved ${data?.length || 0} registrations from Supabase`);
    if (data && data.length > 0) {
      console.log('First registration:', data[0]);
    } else {
      console.log('No registrations found in database');
    }
    
    // If we get an empty array but know there should be data, there might be a permission issue
    if (data && data.length === 0 && count && count > 0) {
      console.warn(
        'Found a mismatch: count shows records exist but query returned empty array. Possible RLS policy issue.'
      );

      // Do NOT sign in anonymously here.
      // Anonymous sessions can mask real auth issues and can overwrite an admin session.
      const { data: authData } = await supabase.auth.getSession();
      console.log('Auth session state:', authData);

      if (!authData.session) {
        console.log('Not authenticated. Admin pages require a real admin login.');
      }
    }

    // The data from Supabase will be in snake_case format, so we need to convert it
    // We'll perform this transformation in the useAdminDashboard hook for flexibility
    return data as unknown as Registration[];
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    return [];
  }
};
