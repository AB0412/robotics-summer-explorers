
import { useToast } from '@/hooks/use-toast';
import { deleteRegistration } from '@/utils/database/operations/deleteRegistration';
import { EnhancedRegistration } from '@/utils/database';

export function useRegistrationDelete(
  registrations: EnhancedRegistration[],
  setRegistrations: React.Dispatch<React.SetStateAction<EnhancedRegistration[]>>,
  currentPage: number,
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>,
  filteredRegistrations: EnhancedRegistration[],
  itemsPerPage: number
) {
  const { toast } = useToast();

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
      const updatedFilteredRegistrations = filteredRegistrations.filter(
        reg => reg.registrationId !== registrationId
      );
      const totalPages = Math.ceil(updatedFilteredRegistrations.length / itemsPerPage);
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

  return {
    handleDeleteRegistration
  };
}
