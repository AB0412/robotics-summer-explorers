
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../../supabase/client';

// Delete a registration
export const deleteRegistration = async (registrationId: string): Promise<{success: boolean; error?: string}> => {
  // If no valid Supabase credentials, don't attempt to delete
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot delete registration.');
    return {
      success: false,
      error: 'Missing Supabase credentials. Cannot delete registration.'
    };
  }

  try {
    console.log(`Attempting to delete registration with ID: ${registrationId}`);
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .eq('registrationid', registrationId.toLowerCase());  // Use lowercase column name
    
    if (error) {
      console.error('Error deleting registration from Supabase:', error);
      return {
        success: false,
        error: `Error deleting registration: ${error.message}`
      };
    } else {
      console.log(`Successfully deleted registration with ID: ${registrationId}`);
      return {
        success: true
      };
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
};
