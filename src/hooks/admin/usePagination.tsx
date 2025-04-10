
import { useState, useMemo } from 'react';
import { EnhancedRegistration } from '@/utils/database';

export function usePagination(filteredRegistrations: EnhancedRegistration[], itemsPerPage: number = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredRegistrations.length / itemsPerPage);
  }, [filteredRegistrations.length, itemsPerPage]);

  // Get current page items
  const currentItems = useMemo(() => {
    return filteredRegistrations.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    );
  }, [filteredRegistrations, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    itemsPerPage
  };
}
