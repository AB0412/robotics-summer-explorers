
import { useState, useMemo } from 'react';
import { EnhancedRegistration } from '@/utils/database';

export function useRegistrationSearch(registrations: EnhancedRegistration[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');

  // Filter registrations based on search term and selected filter
  const getFilteredRegistrations = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return registrations.filter(reg => {
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
  }, [registrations, searchTerm, searchFilter]);

  return {
    searchTerm,
    searchFilter,
    setSearchTerm,
    setSearchFilter,
    filteredRegistrations: getFilteredRegistrations
  };
}
