
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { Registration, SupabaseRegistration } from './types';

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
      return [];
    }
    
    console.log(`Table contains approximately ${count} records`);
    
    // Now get the actual data
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error getting registrations:', error);
      console.log('Error details:', error.details);
      console.log('Error hint:', error.hint);
      console.log('Error code:', error.code);
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
      console.warn('Found a mismatch: count shows records exist but query returned empty array. Possible RLS policy issue.');
    }
    
    // The data from Supabase will be in snake_case format, so we need to convert it
    // We'll perform this transformation in the useAdminDashboard hook for flexibility
    return data as any[];
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
    
    // Convert from camelCase to lowercase/snake_case for Supabase
    const supabaseRegistration: SupabaseRegistration = {
      registrationid: registration.registrationId,
      parentname: registration.parentName,
      parentemail: registration.parentEmail,
      parentphone: registration.parentPhone,
      emergencycontact: registration.emergencyContact,
      childname: registration.childName,
      childage: registration.childAge,
      childgrade: registration.childGrade,
      schoolname: registration.schoolName,
      medicalinfo: registration.medicalInfo,
      preferredbatch: registration.preferredBatch,
      alternatebatch: registration.alternateBatch,
      haspriorexperience: registration.hasPriorExperience,
      experiencedescription: registration.experienceDescription,
      interestlevel: registration.interestLevel,
      referralsource: registration.referralSource,
      photoconsent: registration.photoConsent,
      waiveragreement: registration.waiverAgreement,
      tshirtsize: registration.tShirtSize,
      specialrequests: registration.specialRequests,
      volunteerinterest: registration.volunteerInterest,
      submittedat: registration.submittedAt
    };
    
    console.log('Formatted registration with snake_case keys:', supabaseRegistration);
    
    // Try to insert with explicit type safety
    console.log(`Inserting into table: ${REGISTRATIONS_TABLE}`);
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert([supabaseRegistration])
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
