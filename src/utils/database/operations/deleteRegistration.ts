import { supabase } from '@/integrations/supabase/client';
import { REGISTRATIONS_TABLE, hasValidCredentials } from '@/utils/supabase/client';

// Delete a registration
export const deleteRegistration = async (
  registrationId: string
): Promise<{ success: boolean; error?: string }> => {
  // If no valid backend credentials, don't attempt to delete
  if (!hasValidCredentials()) {
    console.error('Missing backend credentials. Cannot delete registration.');
    return {
      success: false,
      error: 'Missing backend credentials. Cannot delete registration.',
    };
  }

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      return {
        success: false,
        error: 'You must be logged in as an admin to delete registrations.',
      };
    }

    const userId = sessionData.session.user.id;

    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });

    if (roleError) {
      console.error('Error checking admin role:', roleError);
      return {
        success: false,
        error: `Unable to verify admin role: ${roleError.message}`,
      };
    }

    if (!isAdmin) {
      return {
        success: false,
        error: 'Your account is not authorized to delete registrations.',
      };
    }

    console.log(`Attempting to delete registration with ID: ${registrationId}`, {
      userId,
      isAdmin,
    });

    // First check if the registration exists to provide better error messages
    const { data: beforeDelete, error: checkError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('registrationid')
      .eq('registrationid', registrationId);

    if (checkError) {
      console.error('Error checking registration:', checkError);
      return {
        success: false,
        error: `Error finding registration: ${checkError.message}`,
      };
    }

    if (!beforeDelete || beforeDelete.length === 0) {
      console.error(`Registration with ID ${registrationId} not found in database`);
      return {
        success: false,
        error: `Registration with ID ${registrationId} not found`,
      };
    }

    console.log(`Found ${beforeDelete.length} matching registration(s) with ID: ${registrationId}`);

    // Now perform the actual delete operation
    const { error } = await supabase.from(REGISTRATIONS_TABLE).delete().eq('registrationid', registrationId);

    if (error) {
      console.error('Error deleting registration from backend:', error);
      return {
        success: false,
        error: `Error deleting registration: ${error.message}`,
      };
    }

    // Verify deletion was successful
    const { data: afterDelete, error: verifyError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('registrationid')
      .eq('registrationid', registrationId);

    if (verifyError) {
      console.error('Error verifying deletion:', verifyError);
    } else if (afterDelete && afterDelete.length > 0) {
      console.warn(`Warning: Registration still exists after deletion attempt: ${registrationId}`);
      return {
        success: false,
        error: 'Delete operation completed but registration still exists',
      };
    }

    console.log(`Successfully deleted registration with ID: ${registrationId}`);
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error accessing backend:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
  }
};

