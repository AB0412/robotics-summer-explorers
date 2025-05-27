
import { supabase } from '@/integrations/supabase/client';
import type { Registration, SupabaseRegistration } from './types';

const REGISTRATIONS_TABLE = 'registrations';

/**
 * Converts database row to Registration type
 */
const convertDbToRegistration = (dbRow: any): Registration => {
  return {
    registrationId: dbRow.registrationid,
    parentName: dbRow.parentname,
    parentEmail: dbRow.parentemail,
    parentPhone: dbRow.parentphone,
    emergencyContact: dbRow.emergencycontact,
    childName: dbRow.childname,
    childAge: dbRow.childage,
    childGrade: dbRow.childgrade,
    schoolName: dbRow.schoolname,
    medicalInfo: dbRow.medicalinfo || '',
    preferredBatch: dbRow.preferredbatch,
    alternateBatch: dbRow.alternatebatch || '',
    hasPriorExperience: dbRow.haspriorexperience,
    experienceDescription: dbRow.experiencedescription || '',
    interestLevel: dbRow.interestlevel || '',
    referralSource: dbRow.referralsource,
    photoConsent: dbRow.photoconsent,
    waiverAgreement: dbRow.waiveragreement,
    tShirtSize: dbRow.tshirtsize || '',
    specialRequests: dbRow.specialrequests || '',
    volunteerInterest: dbRow.volunteerinterest,
    submittedAt: dbRow.submittedat,
  };
};

/**
 * Converts Registration type to database format
 */
const convertRegistrationToDb = (registration: Registration): SupabaseRegistration => {
  return {
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
    submittedat: registration.submittedAt,
  };
};

/**
 * Core function to get all registrations from the database
 * @returns {Promise<Registration[]>} - Array of registrations
 */
export const getRegistrations = async (): Promise<Registration[]> => {
  try {
    console.log('Fetching registrations from database...');
    
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .order('childname');

    if (error) {
      console.error('Error fetching registrations:', error);
      throw new Error(`Failed to fetch registrations: ${error.message}`);
    }

    console.log('Raw database data:', data);
    
    if (!data) {
      console.log('No data returned from database');
      return [];
    }

    // Convert database rows to Registration objects
    const registrations = data.map(convertDbToRegistration);
    console.log('Converted registrations:', registrations);
    
    return registrations;
  } catch (error) {
    console.error('Error in getRegistrations:', error);
    throw error;
  }
};

/**
 * Core function to add a registration to the database
 * @param {Registration} registration - The registration to add
 * @returns {Promise<boolean>} - Success status
 */
export const addRegistration = async (registration: Registration): Promise<boolean> => {
  try {
    console.log('Adding registration to database:', registration);
    
    const dbData = convertRegistrationToDb(registration);
    
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert([dbData])
      .select();

    if (error) {
      console.error('Error adding registration:', error);
      throw new Error(`Failed to add registration: ${error.message}`);
    }

    console.log('Registration added successfully:', data);
    return true;
  } catch (error) {
    console.error('Error in addRegistration:', error);
    return false;
  }
};

/**
 * Core function to delete a registration from the database
 * @param {string} registrationId - The ID of the registration to delete
 * @returns {Promise<boolean>} - Success status
 */
export const deleteRegistration = async (registrationId: string): Promise<boolean> => {
  try {
    console.log('Deleting registration with ID:', registrationId);
    
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .eq('registrationid', registrationId);

    if (error) {
      console.error('Error deleting registration:', error);
      throw new Error(`Failed to delete registration: ${error.message}`);
    }

    console.log('Registration deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteRegistration:', error);
    return false;
  }
};

/**
 * Formats registration data to match the database schema
 */
export const formatRegistrationData = (registration: Registration): SupabaseRegistration => {
  return convertRegistrationToDb(registration);
};

/**
 * Core function to import registrations from an array
 * @param {Registration[]} registrations - Array of registrations to import
 * @returns {Promise<boolean>} - Success status
 */
export const importRegistrations = async (registrations: Registration[]): Promise<boolean> => {
  try {
    console.log('Importing registrations:', registrations.length);
    
    const dbDataArray = registrations.map(convertRegistrationToDb);
    
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(dbDataArray)
      .select();

    if (error) {
      console.error('Error importing registrations:', error);
      throw new Error(`Failed to import registrations: ${error.message}`);
    }

    console.log('Registrations imported successfully:', data?.length || 0);
    return true;
  } catch (error) {
    console.error('Error in importRegistrations:', error);
    return false;
  }
};
