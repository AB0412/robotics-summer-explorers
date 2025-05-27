
import { supabase, REGISTRATIONS_TABLE } from '@/integrations/supabase/client';
import { Registration } from './types';

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

// Search registrations by field and term
export const searchRegistrations = async (
  field: 'all' | 'parentName' | 'childName' | 'parentEmail' | 'registrationId',
  term: string
): Promise<Registration[]> => {
  try {
    if (!term.trim()) {
      // Import the function dynamically to avoid circular dependencies
      const { getAllRegistrations } = await import('./registrations');
      return getAllRegistrations();
    }
    
    if (field === 'all') {
      // For 'all' we need to make multiple queries and combine results using snake_case column names
      const [nameResults, emailResults, idResults, childNameResults] = await Promise.all([
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentname', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentemail', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('registrationid', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('childname', `%${term}%`)
      ]);
      
      // Combine results, removing duplicates
      const combinedResults = [
        ...(nameResults.data || []),
        ...(emailResults.data || []),
        ...(idResults.data || []),
        ...(childNameResults.data || [])
      ];
      
      // Remove duplicates by registrationid (snake_case)
      const uniqueResults = Array.from(
        new Map(combinedResults.map(item => [item.registrationid, item])).values()
      );
      
      // Convert to camelCase
      return uniqueResults.map(convertSupabaseToRegistration);
    } else {
      // Map camelCase field names to snake_case column names
      const fieldMapping: Record<string, string> = {
        parentName: 'parentname',
        childName: 'childname', 
        parentEmail: 'parentemail',
        registrationId: 'registrationid'
      };
      
      const dbField = fieldMapping[field] || field;
      
      // For specific fields, we can do a single query
      const { data, error } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*')
        .ilike(dbField, `%${term}%`);
      
      if (error) {
        console.error(`Error searching registrations by ${field}:`, error);
        return [];
      }
      
      // Convert to camelCase
      return (data || []).map(convertSupabaseToRegistration);
    }
  } catch (error) {
    console.error('Error searching registrations:', error);
    return [];
  }
};
