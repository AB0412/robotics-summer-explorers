
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../../supabase/client';
import { Registration, SupabaseRegistration } from '../types';

// Add a new registration
export const addRegistration = async (registration: Registration): Promise<{success: boolean; error?: string}> => {
  // No credential check needed - RLS policies handle anonymous registration
  try {
    console.log('Attempting to add registration to Supabase:', registration);
    
    // Convert from camelCase to lowercase/snake_case for Supabase
    const supabaseRegistration: SupabaseRegistration = {
      user_id: null, // Set to null for anonymous registrations
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
      programtype: registration.programType,
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
        errorMessage = "Registration submission blocked. This appears to be a database permissions issue. Please contact the administrator.";
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
