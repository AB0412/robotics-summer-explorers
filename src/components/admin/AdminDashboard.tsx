
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardToolbar } from './DashboardToolbar';
import { RegistrationsTable } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, ShieldAlert } from 'lucide-react';
import { SchemaUpdateModal } from './SchemaUpdateModal';
import { validateDatabaseSchema } from '@/utils/database/schema-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase, REGISTRATIONS_TABLE } from '@/utils/database';

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
  const [showRlsAlert, setShowRlsAlert] = useState(false);

  // Check if schema needs updating
  React.useEffect(() => {
    const checkSchema = async () => {
      const isValid = await validateDatabaseSchema();
      setNeedsSchemaUpdate(!isValid);
    };
    checkSchema();
    
    // Check for RLS issues
    const checkRls = async () => {
      try {
        const { count } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('*', { count: 'exact', head: true });
          
        const { data } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('*');
          
        if ((count || 0) > 0 && (!data || data.length === 0)) {
          console.warn('Possible RLS issue: count shows records but query returns none');
          setShowRlsAlert(true);
        }
      } catch (error) {
        console.error('Error checking RLS:', error);
      }
    };
    
    checkRls();
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
      setShowRlsAlert(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle login for direct database access
  const handleDbLogin = async () => {
    try {
      // Try to authenticate with service role if available,
      // or anonymous auth as fallback
      await supabase.auth.signInAnonymously();
      await loadRegistrations();
      setShowRlsAlert(false);
    } catch (error) {
      console.error('Login error:', error);
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
      
      {showRlsAlert && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <ShieldAlert className="h-5 w-5 text-red-500 mr-2" />
            <span>Row Level Security (RLS) policy may be blocking data access. Database counts show records exist but none are being returned.</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white" onClick={() => setSchemaModalOpen(true)}>
              View SQL Update Script
            </Button>
            <Button variant="outline" className="bg-white" onClick={handleDbLogin}>
              Authentication Fix
            </Button>
          </div>
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
              {registrations.length === 0 && (
                <Alert className="mb-4">
                  <AlertDescription>
                    No registrations found. If you believe records should be present, try clicking the "Refresh Data" button or check the Supabase dashboard to verify records exist.
                  </AlertDescription>
                </Alert>
              )}
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
}
