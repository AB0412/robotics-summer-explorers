
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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

  // Filter registrations based on search term and selected filter
  const filteredRegistrations = registrations.filter(reg => {
    const searchTermLower = searchTerm.toLowerCase();
    
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
          <RegistrationsTable registrations={currentRegistrations} />
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
