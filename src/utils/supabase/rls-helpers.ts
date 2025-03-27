
import { supabase, REGISTRATIONS_TABLE } from './client';

/**
 * Function to verify RLS policies are correctly set up
 */
export const checkRLSPolicies = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // First check if we can get a count of registrations
    const { count, error: countError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error checking registrations count:', countError);
      return {
        success: false,
        message: `Cannot access the registrations table: ${countError.message}`,
        details: countError
      };
    }
    
    // Then try to get some actual data
    const { data, error: dataError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .limit(5);
      
    if (dataError) {
      console.error('Error fetching registrations:', dataError);
      return {
        success: false,
        message: `Cannot fetch registrations: ${dataError.message}`,
        details: dataError
      };
    }
    
    // Check if there's a mismatch between count and data
    if ((count || 0) > 0 && (!data || data.length === 0)) {
      return {
        success: false,
        message: 'RLS policies may be blocking data access. Count shows records exist but query returns none.',
        details: { count, dataLength: data?.length }
      };
    }
    
    return {
      success: true,
      message: `RLS policies are working correctly. Found ${count} registrations.`
    };
  } catch (error) {
    console.error('Error checking RLS policies:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error checking RLS policies',
      details: error
    };
  }
};

/**
 * Function to fix common RLS policy issues
 */
export const fixRLSPolicies = async (): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> => {
  try {
    // Attempt to sign in anonymously if not already signed in
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        return {
          success: false,
          message: `Anonymous sign-in failed: ${signInError.message}`,
          details: signInError
        };
      }
    }
    
    // Try the database access again
    const { success, message } = await checkRLSPolicies();
    
    return {
      success,
      message: success ? 'RLS issues fixed successfully' : `RLS issues still exist: ${message}`
    };
  } catch (error) {
    console.error('Error fixing RLS policies:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error fixing RLS policies',
      details: error
    };
  }
};
