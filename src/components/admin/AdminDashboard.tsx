
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardToolbar } from './DashboardToolbar';
import { RegistrationsTable } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw } from 'lucide-react';
import { SchemaUpdateModal } from './SchemaUpdateModal';
import { validateDatabaseSchema } from '@/utils/database/schema-utils';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const {
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
  } = useAdminDashboard();

  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [needsSchemaUpdate, setNeedsSchemaUpdate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check if schema needs updating
  React.useEffect(() => {
    const checkSchema = async () => {
      const isValid = await validateDatabaseSchema();
      setNeedsSchemaUpdate(!isValid);
    };
    checkSchema();
  }, []);

  // Get filtered registrations
  const filteredRegistrations = getFilteredRegistrations();

  // Pagination logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle manual refresh
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadRegistrations();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <DashboardToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        onImport={loadRegistrations}
        onLogout={onLogout}
      />
      
      {needsSchemaUpdate && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-yellow-500 mr-2" />
            <span>Your database schema needs to be updated to support all features.</span>
          </div>
          <Button variant="outline" className="bg-white" onClick={() => setSchemaModalOpen(true)}>
            View SQL Update Script
          </Button>
        </div>
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading registrations...</span>
            </div>
          ) : (
            <>
              <RegistrationsTable 
                registrations={currentRegistrations} 
                onDeleteRegistration={handleDeleteRegistration} 
              />
              <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <SchemaUpdateModal 
        open={schemaModalOpen} 
        onOpenChange={setSchemaModalOpen} 
      />
    </>
  );
};
