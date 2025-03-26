
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SearchBar } from './SearchBar';
import { RegistrationsTable, EnhancedRegistration } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<EnhancedRegistration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = () => {
    // Load registrations from localStorage
    const savedRegistrations = localStorage.getItem('registrations');
    if (savedRegistrations) {
      setRegistrations(JSON.parse(savedRegistrations));
    }
  };

  const handleDeleteRegistration = (registrationId: string) => {
    // Find and remove the registration with the given ID
    const updatedRegistrations = registrations.filter(
      reg => reg.registrationId !== registrationId
    );
    
    // Update state
    setRegistrations(updatedRegistrations);
    
    // Update localStorage
    localStorage.setItem('registrations', JSON.stringify(updatedRegistrations));
    
    // Show toast notification
    toast({
      title: "Registration Deleted",
      description: `Registration ${registrationId} has been successfully deleted.`,
    });
    
    // If current page is now empty (except for the last page), go to previous page
    const filteredRegs = getFilteredRegistrations(updatedRegistrations);
    const totalPages = Math.ceil(filteredRegs.length / itemsPerPage);
    if (currentPage > totalPages && currentPage > 1) {
      setCurrentPage(totalPage => totalPage - 1);
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

  // Get filtered registrations
  const filteredRegistrations = getFilteredRegistrations();

  // Pagination logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistrationsTable 
            registrations={currentRegistrations} 
            onDeleteRegistration={handleDeleteRegistration} 
          />
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </>
  );
};
