import { supabase } from '@/integrations/supabase/client';

/**
 * Checks the database connection by attempting to execute a simple query.
 */
export const checkDatabaseConnection = async (): Promise<{
  connected: boolean;
  error?: string;
  permissions?: {
    read: boolean;
    write: boolean;
  };
}> => {
  try {
    // Test read permission
    const { error: readError } = await supabase
      .from('registrations')
      .select('count')
      .limit(1);
      
    if (readError) {
      console.error('Read permission check failed:', readError);
      return {
        connected: false,
        error: `Read permission check failed: ${readError.message}`,
        permissions: {
          read: false,
          write: false
        }
      };
    }
    
    // Test write permission (attempt to insert and then delete)
    const testData = { registrationid: 'test-write-permission', parentname: 'Test', parentemail: 'test@example.com', parentphone: '1234567890', emergencycontact: 'Test', childname: 'Test', childage: '5', childgrade: 'K', schoolname: 'Test', preferredbatch: 'Morning', haspriorexperience: 'no', referralsource: 'Other', photoconsent: false, waiveragreement: true, submittedat: new Date().toISOString() };
    
    const { error: insertError } = await supabase
      .from('registrations')
      .insert([testData]);
      
    if (insertError) {
      console.error('Write permission check (insert) failed:', insertError);
      return {
        connected: false,
        error: `Write permission check (insert) failed: ${insertError.message}`,
        permissions: {
          read: true,
          write: false
        }
      };
    }
    
    // If insert was successful, attempt to delete the test record
    const { error: deleteError } = await supabase
      .from('registrations')
      .delete()
      .eq('registrationid', 'test-write-permission');
      
    if (deleteError) {
      console.warn('Write permission check (delete) failed:', deleteError);
      return {
        connected: true,
        error: `Write permission check (delete) failed: ${deleteError.message}`,
        permissions: {
          read: true,
          write: false
        }
      };
    }
    
    return {
      connected: true,
      permissions: {
        read: true,
        write: true
      }
    };
  } catch (error) {
    console.error('Error checking database connection:', error);
    return {
      connected: false,
      error: `Error checking database connection: ${error instanceof Error ? error.message : String(error)}`,
      permissions: {
        read: false,
        write: false
      }
    };
  }
};
