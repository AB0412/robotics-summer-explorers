
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
    // IMPORTANT: Do not create anonymous sessions.
    // This helper should never overwrite an existing admin session.
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return {
        success: false,
        message: 'Authentication required to check policies. Please log in as admin.',
      };
    }

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
    // Check if we already have a session
    const { data: sessionData } = await supabase.auth.getSession();

    // Clear existing session if there's an issue
    if (sessionData.session?.expires_at) {
      const expiryTimestamp = new Date(sessionData.session.expires_at * 1000);
      if (expiryTimestamp < new Date()) {
        // Session has expired, sign out first
        await supabase.auth.signOut();
        console.log('Expired session cleared');
      }
    }

    // IMPORTANT: Do not create anonymous sessions.
    const { data: freshSessionData } = await supabase.auth.getSession();

    if (!freshSessionData.session) {
      return {
        success: false,
        message: 'Authentication required to fix policy access. Please log in as admin.',
      };
    }

    // Try the database access again
    const { success, message } = await checkRLSPolicies();
    
    if (!success) {
      // Try a more aggressive approach - add a retry with a bit more delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryResult = await checkRLSPolicies();
      
      if (retryResult.success) {
        return {
          success: true,
          message: 'RLS issues fixed successfully after retry'
        };
      }
      
      // If still failing, return the original error
      return {
        success: false,
        message: `RLS issues still exist after fix attempt: ${message}`
      };
    }
    
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
