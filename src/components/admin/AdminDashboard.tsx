import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardToolbar } from './DashboardToolbar';
import { RegistrationsTable } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, DollarSign, Users } from 'lucide-react';
import { SchemaUpdateModal } from './SchemaUpdateModal';
import { validateDatabaseSchema } from '@/utils/database/schema-utils';
import { supabase } from '@/utils/supabase/client';
import { checkRLSPolicies, fixRLSPolicies } from '@/utils/supabase/rls-helpers';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const {
    registrations,
    currentPage,
    searchTerm,
    searchFilter,
    programTypeFilter,
    isLoading,
    itemsPerPage,
    setCurrentPage,
    setSearchTerm,
    setSearchFilter,
    setProgramTypeFilter,
    loadRegistrations,
    handleDeleteRegistration,
    getFilteredRegistrations
  } = useAdminDashboard();

  const { toast } = useToast();
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [needsSchemaUpdate, setNeedsSchemaUpdate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFixingRLS, setIsFixingRLS] = useState(false);
  // Add state to track if we've already initialized to prevent double toasts
  const [initialSetupDone, setInitialSetupDone] = useState(false);

  // Check if schema needs updating, auth status, and RLS policies
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check schema validity
        const isValid = await validateDatabaseSchema();
        setNeedsSchemaUpdate(!isValid);
        
        // Check authentication status
        const { data } = await supabase.auth.getSession();
        
        if (!data.session) {
          console.log('User is not authenticated');
          // Don't attempt anonymous sign-in, wait for proper admin authentication
        } else {
          // User is authenticated, load registrations
          loadRegistrations();
        }
        
        // Check RLS policies silently
        await checkRLSPolicies();
        
        // Mark initial setup as done
        setInitialSetupDone(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitialSetupDone(true);
      }
    };
    
    initialize();
  }, [loadRegistrations]);

  // Handle manual refresh with forced authentication
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast({
          title: "Authentication Required",
          description: "Please log in again to refresh data.",
          variant: "destructive",
        });
        setIsRefreshing(false);
        return;
      }
      
      // Now try to load registrations
      await loadRegistrations();
      
      // Check RLS status again silently
      await checkRLSPolicies();
      
      toast({
        title: "Data Refreshed",
        description: "Successfully refreshed registration data.",
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh Failed",
        description: "An error occurred while refreshing data. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle fixing RLS issues
  const handleFixRLS = async () => {
    setIsFixingRLS(true);
    try {
      const result = await fixRLSPolicies();
      
      if (result.success) {
        // Reload registrations after fixing RLS
        await loadRegistrations();
        
        toast({
          title: "RLS Issues Fixed",
          description: result.message,
        });
      } else {
        toast({
          title: "RLS Fix Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fixing RLS:', error);
      toast({
        title: "RLS Fix Error",
        description: error instanceof Error ? error.message : "Unknown error fixing RLS policies",
        variant: "destructive",
      });
    } finally {
      setIsFixingRLS(false);
    }
  };

  // Execute the SQL script from SchemaUpdateModal
  const handleRunSqlScript = async () => {
    try {
      setSchemaModalOpen(true);
      // The SQL script will be available in the modal for the user to run
    } catch (error) {
      console.error('Error preparing SQL script:', error);
    }
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
      {/* Main Navigation */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Student Registrations</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{registrations.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Button
          onClick={() => navigate('/payments')}
          variant="outline"
          className="flex items-center gap-2 h-auto p-4"
        >
          <DollarSign className="h-5 w-5" />
          <div className="text-left">
            <div className="font-medium">Payment Management</div>
            <div className="text-sm text-muted-foreground">Track monthly tuition</div>
          </div>
        </Button>
      </div>

      <DashboardToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        programTypeFilter={programTypeFilter}
        setProgramTypeFilter={setProgramTypeFilter}
        onImport={loadRegistrations}
        onLogout={onLogout}
      />
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registrations ({getFilteredRegistrations().length})</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setSchemaModalOpen(true)}
            >
              <Database className="h-4 w-4 mr-2" />
              Database Setup
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
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
                registrations={getFilteredRegistrations().slice(
                  (currentPage - 1) * itemsPerPage, 
                  currentPage * itemsPerPage
                )} 
                onDeleteRegistration={handleDeleteRegistration} 
              />
              <PaginationControls 
                currentPage={currentPage}
                totalPages={Math.ceil(getFilteredRegistrations().length / itemsPerPage)}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
      
      <SchemaUpdateModal 
        open={schemaModalOpen} 
        onOpenChange={setSchemaModalOpen} 
        onRefreshData={handleManualRefresh}
      />
    </>
  );
};
