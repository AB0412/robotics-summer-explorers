
import { useState, useMemo } from 'react';
import { EnhancedRegistration } from '@/utils/database';

export function useRegistrationSearch(registrations: EnhancedRegistration[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [programTypeFilter, setProgramTypeFilter] = useState('all');

  // Helper function to determine program type based on submission date
  const getProgramTypeByDate = (submittedAt: string): 'summer-camp' | 'regular' => {
    if (!submittedAt) return 'regular';
    
    try {
      // Parse the submitted date - it could be in various formats
      const submissionDate = new Date(submittedAt);
      const cutoffDate = new Date('2024-06-10'); // June 10th cutoff
      
      // If submission date is before June 10th, it's summer camp
      return submissionDate < cutoffDate ? 'summer-camp' : 'regular';
    } catch (error) {
      console.error('Error parsing submission date:', submittedAt);
      return 'regular'; // Default to regular if date parsing fails
    }
  };

  // Filter registrations based on search term, search filter, and program type
  const getFilteredRegistrations = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return registrations.filter(reg => {
      // First apply program type filter based on submission date
      if (programTypeFilter !== 'all') {
        const actualProgramType = getProgramTypeByDate(reg.submittedAt);
        
        // Map the filter values to our date-based program types
        const targetProgramType = programTypeFilter === 'summer-camp' ? 'summer-camp' : 'regular';
        
        if (actualProgramType !== targetProgramType) {
          return false;
        }
      }
      
      // Then apply search term filter
      if (!searchTermLower) return true;
      
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
  }, [registrations, searchTerm, searchFilter, programTypeFilter]);

  return {
    searchTerm,
    searchFilter,
    programTypeFilter,
    setSearchTerm,
    setSearchFilter,
    setProgramTypeFilter,
    filteredRegistrations: getFilteredRegistrations
  };
}
