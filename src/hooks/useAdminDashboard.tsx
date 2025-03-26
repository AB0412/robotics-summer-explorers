
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllRegistrations, 
  deleteRegistration, 
  exportDatabase, 
  importDatabase, 
  getDownloadLink,
  EnhancedRegistration 
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
      // Load registrations from our database utility - now properly awaiting the Promise
      const loadedRegistrations = await getAllRegistrations();
      console.log("Loaded registrations:", loadedRegistrations);
      
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
        title: "Error",
        description: "Failed to load registrations data.",
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
