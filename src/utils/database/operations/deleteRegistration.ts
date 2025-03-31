
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
    
    // The issue might be here - let's make sure we're using the correct column name
    // From database inspection, we can see the column is "registrationid" (lowercase)
    // Let's add more debugging to identify potential issues
    
    const { data: beforeDelete, error: checkError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('registrationid')
      .eq('registrationid', registrationId);
      
    if (checkError) {
      console.error('Error checking registration:', checkError);
    } else {
      console.log(`Found ${beforeDelete?.length || 0} matching registrations before delete`);
    }
    
    // Now perform the actual delete operation
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .eq('registrationid', registrationId);
    
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
