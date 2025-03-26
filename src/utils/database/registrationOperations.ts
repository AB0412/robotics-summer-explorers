import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { Registration } from './types';

// Get all registrations
export const getAllRegistrations = async (): Promise<Registration[]> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot load registrations.');
    return [];
  }

  try {
    console.log('Attempting to get all registrations from Supabase...');
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error getting registrations:', error);
      return [];
    }
    
    console.log(`Successfully retrieved ${data?.length || 0} registrations from Supabase`);
    return data as Registration[];
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    return [];
  }
};

// Add a new registration
export const addRegistration = async (registration: Registration): Promise<{success: boolean; error?: string}> => {
  // If no valid Supabase credentials, don't attempt to save
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot add registration.');
    console.log('Current credentials state:', { 
      hasCredentials: hasValidCredentials(),
      tableName: REGISTRATIONS_TABLE
    });
    return {
      success: false,
      error: 'Missing Supabase credentials. Cannot add registration.'
    };
  }

  try {
    console.log('Attempting to add registration to Supabase:', registration);
    
    // Test if table exists and is accessible
    const { error: testError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Database connection test failed:', testError);
      console.log('Table name being used:', REGISTRATIONS_TABLE);
      return {
        success: false,
        error: `Database connection test failed: ${testError.message}`
      };
    }
    
    // Convert to lowercase keys for Supabase
    const formattedRegistration = Object.entries(registration).reduce((acc, [key, value]) => {
      acc[key.toLowerCase()] = value;
      return acc;
    }, {} as Record<string, any>);
    
    console.log('Formatted registration with lowercase keys:', formattedRegistration);
    
    // Try to verify if we can insert with RLS policies
    console.log('Checking if we have insert permissions...');
    
    // Fixed approach: Using try/catch instead of .catch() on the RPC call
    let policyError = null;
    try {
      const { error } = await supabase.rpc('check_table_permissions', { 
        table_name: REGISTRATIONS_TABLE,
        permission: 'INSERT' 
      });
      policyError = error;
    } catch (e) {
      // If RPC fails (function doesn't exist), we'll proceed anyway
      console.log('RPC check_table_permissions not available, skipping check');
    }
    
    if (policyError) {
      console.warn('Permission check failed, but proceeding with insert attempt:', policyError);
    }
    
    // Proceed with insertion - let's add more detailed logging
    console.log(`Inserting into table: ${REGISTRATIONS_TABLE}`);
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert([formattedRegistration])
      .select();
    
    if (error) {
      console.error('Error adding registration to Supabase:', error);
      console.log('Error code:', error.code);
      console.log('Error details:', error.details);
      
      let errorMessage = "Could not save your registration to the database.";
      
      // Provide more specific error messages based on error code
      if (error.code === "23505") {
        errorMessage = "A registration with this ID already exists.";
      } else if (error.code === "42P01") {
        errorMessage = "The registrations table doesn't exist in your database.";
      } else if (error.code === "42703") {
        errorMessage = `Column not found in database schema: ${error.message}`;
      } else if (error.code === "42501" || error.message?.includes("policy")) {
        errorMessage = "Row security policy violation. Please check your database permissions and make sure to run the create-table.sql script in the Supabase SQL Editor.";
      } else if (error.code?.startsWith("23")) {
        errorMessage = "The registration data doesn't match the database schema.";
      }
      
      return {
        success: false,
        error: `${errorMessage} (${error.message})`
      };
    } else {
      console.log('Registration successfully added to Supabase:', data);
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
