
import { useRegistrationsData, useRegistrationSearch, useRegistrationDelete, usePagination } from '@/hooks/admin';

export function useAdminDashboard() {
  // Load the registration data
  const { 
    registrations, 
    isLoading, 
    setRegistrations, 
    loadRegistrations 
  } = useRegistrationsData();

  // Handle search functionality
  const { 
    searchTerm, 
    searchFilter, 
    programTypeFilter,
    setSearchTerm, 
    setSearchFilter, 
    setProgramTypeFilter,
    filteredRegistrations 
  } = useRegistrationSearch(registrations);

  // Handle pagination
  const { 
    currentPage, 
    setCurrentPage, 
    totalPages, 
    currentItems, 
    itemsPerPage 
  } = usePagination(filteredRegistrations);

  // Handle delete functionality
  const { 
    handleDeleteRegistration 
  } = useRegistrationDelete(
    registrations, 
    setRegistrations, 
    currentPage, 
    setCurrentPage, 
    filteredRegistrations, 
    itemsPerPage
  );

  return {
    // Core data
    registrations,
    isLoading,
    loadRegistrations,
    
    // Search
    searchTerm,
    searchFilter,
    programTypeFilter,
    setSearchTerm,
    setSearchFilter,
    setProgramTypeFilter,
    getFilteredRegistrations: () => filteredRegistrations,
    
    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    
    // Delete functionality
    handleDeleteRegistration
  };
}
