
import { validateDatabaseSchema } from '@/utils/database/schema/validation';
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '@/utils/supabase/client';
import { checkDatabaseConnection } from '@/utils/database/schema/db-connection';

/**
 * Validates the database schema and connection
 */
export const validateDatabaseSetup = async (): Promise<{
  isValid: boolean;
  error?: string;
  connectionDetails?: any;
}> => {
  try {
    if (!hasValidCredentials()) {
      return {
        isValid: false,
        error: 'No valid Supabase credentials found for database schema validation'
      };
    }

    // Try to sign in anonymously if needed
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      console.log('No active session, attempting to sign in anonymously...');
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        console.error('Anonymous sign-in failed:', signInError);
        return {
          isValid: false,
          error: `Authentication error: ${signInError.message}`
        };
      }
      
      // Wait a moment for auth to complete
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Test connection first
    const connectionResult = await checkDatabaseConnection();
    
    if (!connectionResult.connected) {
      return {
        isValid: false,
        error: `Database connection failed: ${connectionResult.error}. ${connectionResult.permissions?.read === false ? 'Read permission denied.' : ''}`,
        connectionDetails: connectionResult
      };
    }
    
    // Try a direct table access
    const { error: tableError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
          
    if (tableError) {
      console.error('Database table access error:', tableError);
      return {
        isValid: false,
        error: `Database permission error: ${tableError.message}`,
        connectionDetails: connectionResult
      };
    }
    
    const isValid = await validateDatabaseSchema();
    
    if (!isValid) {
      return {
        isValid: false,
        error: 'Database schema validation failed. Please check console logs for details.',
        connectionDetails: connectionResult
      };
    }
    
    return {
      isValid: true,
      connectionDetails: connectionResult
    };
  } catch (error) {
    console.error('Error validating database schema:', error);
    return {
      isValid: false,
      error: `Error checking database: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};
