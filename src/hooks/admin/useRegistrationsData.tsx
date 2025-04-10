
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllRegistrations,
  importDatabase,
  supabase,
  REGISTRATIONS_TABLE,
  EnhancedRegistration
} from '@/utils/database';

export function useRegistrationsData() {
  const [registrations, setRegistrations] = useState<EnhancedRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      
      // First attempt a direct query to get count to verify database access
      const { count, error: countError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error checking database:', countError);
        throw new Error(`Database connection error: ${countError.message}`);
      }
      
      console.log(`Database contains ${count || 0} registrations according to count query`);
      
      // Load registrations from our database utility
      const loadedRegistrations = await getAllRegistrations();
      console.log("Loaded registrations:", loadedRegistrations);
      
      if (loadedRegistrations.length === 0 && count && count > 0) {
        console.warn("Warning: Count shows records exist but query returned empty array. Possible permission issue.");
        toast({
          title: "Permission Issue Detected",
          description: "Database contains records but couldn't retrieve them. Check RLS policies in Supabase.",
          variant: "destructive",
        });
      }
      
      // Map registrations to normalized format with consistent casing
      const normalizedRegistrations = loadedRegistrations.map(normalizeRegistration);
      
      console.log("Normalized registrations:", normalizedRegistrations);
      
      // Set the normalized registrations
      setRegistrations(normalizedRegistrations);
      
      // If we have no registrations but the count shows some exist,
      // try a direct database query as a final fallback
      if (normalizedRegistrations.length === 0 && count && count > 0) {
        tryDirectDatabaseQuery(setRegistrations, toast);
      }
      
      // If no registrations in new DB but exist in old storage, migrate them
      if (loadedRegistrations.length === 0) {
        tryMigrateOldRegistrations(setRegistrations);
      }
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast({
        title: "Database Error",
        description: error instanceof Error ? error.message : "Failed to load registrations data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, []);

  return {
    registrations,
    isLoading,
    setRegistrations,
    loadRegistrations
  };
}

// Helper function to normalize registration data
function normalizeRegistration(reg: any): EnhancedRegistration {
  // Create a properly cased registration object
  return {
    // Use optional chaining and provide defaults for all fields
    registrationId: reg.registrationId || reg.registrationid || '',
    parentName: reg.parentName || reg.parentname || '',
    parentEmail: reg.parentEmail || reg.parentemail || '',
    parentPhone: reg.parentPhone || reg.parentphone || '',
    emergencyContact: reg.emergencyContact || reg.emergencycontact || '',
    childName: reg.childName || reg.childname || '',
    childAge: reg.childAge || reg.childage || '',
    childGrade: reg.childGrade || reg.childgrade || '',
    schoolName: reg.schoolName || reg.schoolname || '',
    medicalInfo: reg.medicalInfo || reg.medicalinfo || '',
    preferredBatch: reg.preferredBatch || reg.preferredbatch || '',
    alternateBatch: reg.alternateBatch || reg.alternatebatch || '',
    hasPriorExperience: (reg.hasPriorExperience || reg.haspriorexperience || 'no') as "yes" | "no",
    experienceDescription: reg.experienceDescription || reg.experiencedescription || '',
    interestLevel: reg.interestLevel || reg.interestlevel || '',
    referralSource: reg.referralSource || reg.referralsource || '',
    photoConsent: !!reg.photoConsent || !!reg.photoconsent,
    waiverAgreement: !!reg.waiverAgreement || !!reg.waiveragreement,
    tShirtSize: reg.tShirtSize || reg.tshirtsize || '',
    specialRequests: reg.specialRequests || reg.specialrequests || '',
    volunteerInterest: !!reg.volunteerInterest || !!reg.volunteerinterest,
    submittedAt: reg.submittedAt || reg.submittedat || ''
  };
}

// Helper function to try a direct database query
async function tryDirectDatabaseQuery(
  setRegistrations: React.Dispatch<React.SetStateAction<EnhancedRegistration[]>>,
  toast: ReturnType<typeof useToast>['toast']
) {
  console.log("Attempting direct database query as fallback...");
  try {
    // Try a direct query without going through getAllRegistrations
    const { data: directData, error: directError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
      
    if (directError) {
      console.error("Direct query error:", directError);
    } else if (directData && directData.length > 0) {
      console.log("Successfully retrieved data via direct query:", directData);
      
      // Normalize the direct data
      const directNormalized = directData.map(reg => normalizeRegistration(reg));
      
      setRegistrations(directNormalized);
      
      toast({
        title: "Data Retrieval Recovered",
        description: `Successfully retrieved ${directNormalized.length} registrations via direct database query.`,
      });
    }
  } catch (directQueryError) {
    console.error("Error in direct database query:", directQueryError);
  }
}

// Helper function to migrate old registrations from localStorage
async function tryMigrateOldRegistrations(
  setRegistrations: React.Dispatch<React.SetStateAction<EnhancedRegistration[]>>
) {
  const oldRegistrations = localStorage.getItem('registrations');
  if (oldRegistrations) {
    try {
      const parsedOldRegistrations = JSON.parse(oldRegistrations);
      if (Array.isArray(parsedOldRegistrations) && parsedOldRegistrations.length > 0) {
        console.log("Migrating old registrations to new database format");
        await importDatabase(JSON.stringify({ registrations: parsedOldRegistrations }));
        // Need the as EnhancedRegistration[] type assertion to satisfy TypeScript
        setRegistrations(parsedOldRegistrations as EnhancedRegistration[]);
      }
    } catch (error) {
      console.error("Error parsing old registrations:", error);
    }
  }
}
