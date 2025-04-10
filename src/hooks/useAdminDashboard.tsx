
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllRegistrations, 
  deleteRegistration, 
  exportDatabase, 
  importDatabase, 
  getDownloadLink,
  EnhancedRegistration,
  supabase,
  REGISTRATIONS_TABLE
} from '@/utils/database';

export function useAdminDashboard() {
  const [registrations, setRegistrations] = useState<EnhancedRegistration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  useEffect(() => {
    loadRegistrations();
  }, []);

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
      // This ensures we handle any case inconsistencies between DB and frontend
      const normalizedRegistrations = loadedRegistrations.map(reg => {
        // Create a properly cased registration object
        const normalized: EnhancedRegistration = {
          // Use optional chaining and provide defaults for all fields
          registrationId: reg.registrationId || (reg as any).registrationid || '',
          parentName: reg.parentName || (reg as any).parentname || '',
          parentEmail: reg.parentEmail || (reg as any).parentemail || '',
          parentPhone: reg.parentPhone || (reg as any).parentphone || '',
          emergencyContact: reg.emergencyContact || (reg as any).emergencycontact || '',
          childName: reg.childName || (reg as any).childname || '',
          childAge: reg.childAge || (reg as any).childage || '',
          childGrade: reg.childGrade || (reg as any).childgrade || '',
          schoolName: reg.schoolName || (reg as any).schoolname || '',
          medicalInfo: reg.medicalInfo || (reg as any).medicalinfo || '',
          preferredBatch: reg.preferredBatch || (reg as any).preferredbatch || '',
          alternateBatch: reg.alternateBatch || (reg as any).alternatebatch || '',
          hasPriorExperience: (reg.hasPriorExperience || (reg as any).haspriorexperience || 'no') as "yes" | "no",
          experienceDescription: reg.experienceDescription || (reg as any).experiencedescription || '',
          interestLevel: reg.interestLevel || (reg as any).interestlevel || '',
          referralSource: reg.referralSource || (reg as any).referralsource || '',
          photoConsent: !!reg.photoConsent || !!(reg as any).photoconsent,
          waiverAgreement: !!reg.waiverAgreement || !!(reg as any).waiveragreement,
          tShirtSize: reg.tShirtSize || (reg as any).tshirtsize || '',
          specialRequests: reg.specialRequests || (reg as any).specialrequests || '',
          volunteerInterest: !!reg.volunteerInterest || !!(reg as any).volunteerinterest,
          submittedAt: reg.submittedAt || (reg as any).submittedat || ''
        };
        return normalized;
      });
      
      console.log("Normalized registrations:", normalizedRegistrations);
      
      // Set the normalized registrations
      setRegistrations(normalizedRegistrations);
      
      // If we have no registrations but the count shows some exist,
      // try a direct database query as a final fallback
      if (normalizedRegistrations.length === 0 && count && count > 0) {
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
            const directNormalized = directData.map(reg => ({
              registrationId: reg.registrationid || '',
              parentName: reg.parentname || '',
              parentEmail: reg.parentemail || '',
              parentPhone: reg.parentphone || '',
              emergencyContact: reg.emergencycontact || '',
              childName: reg.childname || '',
              childAge: reg.childage || '',
              childGrade: reg.childgrade || '',
              schoolName: reg.schoolname || '',
              medicalInfo: reg.medicalinfo || '',
              preferredBatch: reg.preferredbatch || '',
              alternateBatch: reg.alternatebatch || '',
              hasPriorExperience: (reg.haspriorexperience || 'no') as "yes" | "no",
              experienceDescription: reg.experiencedescription || '',
              interestLevel: reg.interestlevel || '',
              referralSource: reg.referralsource || '',
              photoConsent: !!reg.photoconsent,
              waiverAgreement: !!reg.waiveragreement,
              tShirtSize: reg.tshirtsize || '',
              specialRequests: reg.specialrequests || '',
              volunteerInterest: !!reg.volunteerinterest,
              submittedAt: reg.submittedat || ''
            }));
            
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
      
      // If no registrations in new DB but exist in old storage, migrate them
      if (loadedRegistrations.length === 0) {
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

  const handleDeleteRegistration = async (registrationId: string) => {
    try {
      // Delete the registration using our database utility
      const result = await deleteRegistration(registrationId);
      
      if (!result.success) {
        throw new Error(result.error || 'Unknown error deleting registration');
      }
      
      // Update state with the filtered registrations
      setRegistrations(prevRegistrations => 
        prevRegistrations.filter(reg => reg.registrationId !== registrationId)
      );
      
      // Show toast notification
      toast({
        title: "Registration Deleted",
        description: `Registration ${registrationId} has been successfully deleted.`,
      });
      
      // If current page is now empty (except for the last page), go to previous page
      const filteredRegs = getFilteredRegistrations(
        registrations.filter(reg => reg.registrationId !== registrationId)
      );
      const totalPages = Math.ceil(filteredRegs.length / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete the registration. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filter registrations based on search term and selected filter
  const getFilteredRegistrations = (regs = registrations) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return regs.filter(reg => {
      switch(searchFilter) {
        case 'childName':
          return reg.childName.toLowerCase().includes(searchTermLower);
        case 'parentName':
          return reg.parentName.toLowerCase().includes(searchTermLower);
        case 'email':
          return reg.parentEmail.toLowerCase().includes(searchTermLower);
        case 'regId':
          return reg.registrationId?.toLowerCase().includes(searchTermLower);
        case 'all':
        default:
          return (
            reg.parentName.toLowerCase().includes(searchTermLower) ||
            reg.childName.toLowerCase().includes(searchTermLower) ||
            reg.parentEmail.toLowerCase().includes(searchTermLower) ||
            reg.registrationId?.toLowerCase().includes(searchTermLower)
          );
      }
    });
  };

  return {
    registrations,
    currentPage,
    searchTerm,
    searchFilter,
    isLoading,
    itemsPerPage,
    setCurrentPage,
    setSearchTerm,
    setSearchFilter,
    loadRegistrations,
    handleDeleteRegistration,
    getFilteredRegistrations
  };
}
