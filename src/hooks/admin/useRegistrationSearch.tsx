
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
      const cutoffDate = new Date('2025-06-10'); // June 10th 2025 cutoff
      
      console.log('Checking date:', submittedAt, 'Parsed as:', submissionDate, 'Cutoff:', cutoffDate);
      
      // If submission date is before June 10th 2025, it's summer camp
      const isSummerCamp = submissionDate < cutoffDate;
      console.log('Is summer camp:', isSummerCamp);
      
      return isSummerCamp ? 'summer-camp' : 'regular';
    } catch (error) {
      console.error('Error parsing submission date:', submittedAt, error);
      return 'regular'; // Default to regular if date parsing fails
    }
  };

  // Filter registrations based on search term, search filter, and program type
  const getFilteredRegistrations = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    
    console.log('Filtering with program type filter:', programTypeFilter);
    console.log('Total registrations:', registrations.length);
    
    const filtered = registrations.filter(reg => {
      // First apply program type filter based on submission date
      if (programTypeFilter !== 'all') {
        const actualProgramType = getProgramTypeByDate(reg.submittedAt);
        
        // Map the filter values to our date-based program types
        const targetProgramType = programTypeFilter === 'summer-camp' ? 'summer-camp' : 'regular';
        
        console.log('Registration:', reg.childName, 'Date:', reg.submittedAt, 'Actual type:', actualProgramType, 'Target type:', targetProgramType);
        
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
    
    console.log('Filtered registrations count:', filtered.length);
    return filtered;
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
