
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '@/integrations/supabase/client';
import { DBStorage, emptyDB, Registration, SupabaseRegistration } from './types';

// Helper function to convert snake_case to camelCase
const convertSupabaseToRegistration = (supabaseReg: any): Registration => {
  return {
    registrationId: supabaseReg.registrationid,
    parentName: supabaseReg.parentname,
    parentEmail: supabaseReg.parentemail,
    parentPhone: supabaseReg.parentphone,
    emergencyContact: supabaseReg.emergencycontact,
    childName: supabaseReg.childname,
    childAge: supabaseReg.childage,
    childGrade: supabaseReg.childgrade,
    schoolName: supabaseReg.schoolname,
    medicalInfo: supabaseReg.medicalinfo,
    preferredBatch: supabaseReg.preferredbatch,
    alternateBatch: supabaseReg.alternatebatch,
    hasPriorExperience: supabaseReg.haspriorexperience,
    experienceDescription: supabaseReg.experiencedescription,
    interestLevel: supabaseReg.interestlevel,
    referralSource: supabaseReg.referralsource,
    photoConsent: supabaseReg.photoconsent,
    waiverAgreement: supabaseReg.waiveragreement,
    tShirtSize: supabaseReg.tshirtsize,
    specialRequests: supabaseReg.specialrequests,
    volunteerInterest: supabaseReg.volunteerinterest,
    submittedAt: supabaseReg.submittedat
  };
};

// Helper function to convert camelCase to snake_case
const convertRegistrationToSupabase = (registration: Registration): SupabaseRegistration => {
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
    submittedat: registration.submittedAt
  };
};

// Helper function to convert registrations to CSV format
const convertToCSV = (registrations: any[]): string => {
  if (registrations.length === 0) return '';
  
  // Get all unique keys from all registrations
  const allKeys = new Set<string>();
  registrations.forEach(reg => {
    Object.keys(reg).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  
  // Create CSV header row
  const csvHeaders = headers.map(header => `"${header}"`).join(',');
  
  // Create CSV data rows
  const csvRows = registrations.map(reg => {
    return headers.map(header => {
      const value = reg[header] || '';
      // Escape quotes in values and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

// Check database readiness
export const isDatabaseReady = async (): Promise<boolean> => {
  if (!hasValidCredentials()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
      
    return !error;
  } catch (error) {
    console.error('Error checking database readiness:', error);
    return false;
  }
};

// Load all data from Supabase
export const loadDatabase = async (): Promise<{success: boolean; data?: DBStorage; error?: string}> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot load database.');
    return {
      success: false,
      error: 'Missing Supabase credentials. Cannot load database.',
      data: emptyDB
    };
  }

  try {
    console.log('Attempting to load registrations from Supabase...');
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error loading registrations from Supabase:', error);
      return {
        success: false,
        error: `Could not load registrations from the database: ${error.message}`,
        data: emptyDB
      };
    }
    
    // Convert snake_case to camelCase
    const registrations = (data || []).map(convertSupabaseToRegistration);
    
    console.log(`Successfully loaded ${registrations.length} registrations from Supabase`);
    return {
      success: true,
      data: {
        registrations
      }
    };
  } catch (error) {
    console.error('Error accessing Supabase database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      data: emptyDB
    };
  }
};

// Save the entire database
export const saveDatabase = async (db: DBStorage): Promise<{success: boolean; error?: string}> => {
  // If no valid Supabase credentials, don't attempt to save
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot save database.');
    return {
      success: false,
      error: 'Missing Supabase credentials. Cannot save database.'
    };
  }

  try {
    // First, delete all records
    const { error: deleteError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .neq('registrationid', ''); // Delete all records
    
    if (deleteError) {
      console.error('Error deleting registrations:', deleteError);
      return {
        success: false,
        error: `Failed to update the database. Could not clear existing records: ${deleteError.message}`
      };
    }
    
    // Then insert all the registrations
    if (db.registrations.length > 0) {
      // Convert to snake_case format
      const supabaseRegistrations = db.registrations.map(convertRegistrationToSupabase);
      
      const { error: insertError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .insert(supabaseRegistrations);
      
      if (insertError) {
        console.error('Error inserting registrations:', insertError);
        return {
          success: false,
          error: `Failed to save your changes to the database: ${insertError.message}`
        };
      }
    }
    
    // Create downloadable CSV blob for export feature
    const csvData = convertToCSV(db.registrations);
    const blob = new Blob([csvData], { type: 'text/csv' });
    
    // Store the latest blob in sessionStorage for easy access
    sessionStorage.setItem('latestRegistrationsBlob', URL.createObjectURL(blob));
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error saving database to Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
};
