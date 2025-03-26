
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardToolbar } from './DashboardToolbar';
import { RegistrationsTable } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, ShieldAlert, AlertTriangle } from 'lucide-react';
import { SchemaUpdateModal } from './SchemaUpdateModal';
import { validateDatabaseSchema } from '@/utils/database/schema-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

  const { toast } = useToast();
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [needsSchemaUpdate, setNeedsSchemaUpdate] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showRlsAlert, setShowRlsAlert] = useState(false);
  const [authStatus, setAuthStatus] = useState<string | null>(null);

  // Check if schema needs updating and auth status
  useEffect(() => {
    const checkSchema = async () => {
      const isValid = await validateDatabaseSchema();
      setNeedsSchemaUpdate(!isValid);
    };
    checkSchema();
    
    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setAuthStatus(data.session ? 'authenticated' : 'unauthenticated');
      
      if (!data.session) {
        console.log('User is not authenticated, attempting anonymous sign-in');
        try {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) {
            console.error('Anonymous sign-in failed:', error);
          } else {
            setAuthStatus('authenticated (anon)');
            // Reload registrations after authentication
            loadRegistrations();
          }
        } catch (err) {
          console.error('Auth error:', err);
        }
      }
    };
    checkAuth();
    
    // Check for RLS issues
    const checkRls = async () => {
      try {
        const { count, error: countError } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.error('RLS count check error:', countError);
          setShowRlsAlert(true);
          return;
        }
          
        const { data, error: dataError } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('*');
        
        if (dataError) {
          console.error('RLS data check error:', dataError);
          setShowRlsAlert(true);
          return;
        }
          
        if ((count || 0) > 0 && (!data || data.length === 0)) {
          console.warn('Possible RLS issue: count shows records but query returns none');
          setShowRlsAlert(true);
        }
      } catch (error) {
        console.error('Error checking RLS:', error);
      }
    };
    
    checkRls();
  }, [loadRegistrations]);

  // Get filtered registrations
  const filteredRegistrations = getFilteredRegistrations();

  // Pagination logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Handle manual refresh with forced authentication
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      // First try to authenticate with service role
      const { error: signInError } = await supabase.auth.signInAnonymously();
      if (signInError) {
        console.error('Sign in error:', signInError);
        toast({
          title: "Authentication Error",
          description: "Could not authenticate with Supabase. Check console for details.",
          variant: "destructive",
        });
      }
      
      // Now try to load registrations
      await loadRegistrations();
      setShowRlsAlert(false);
      
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

  // Execute the SQL script from SchemaUpdateModal
  const handleRunSqlScript = async () => {
    try {
      setSchemaModalOpen(true);
      // The SQL script will be available in the modal for the user to run
    } catch (error) {
      console.error('Error preparing SQL script:', error);
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
      
      {authStatus && (
        <Alert className="mb-4 bg-blue-50">
          <Database className="h-4 w-4 text-blue-500 mr-2" />
          <AlertDescription className="text-blue-700">
            Authentication status: {authStatus}. {authStatus === 'unauthenticated' && 
              "You may need to refresh the page to access data."}
          </AlertDescription>
        </Alert>
      )}
      
      {needsSchemaUpdate && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 text-yellow-500 mr-2" />
            <span>Your database schema needs to be updated to support all features.</span>
          </div>
          <Button variant="outline" className="bg-white" onClick={handleRunSqlScript}>
            Run SQL Update Script
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
            <Button variant="outline" className="bg-white" onClick={handleRunSqlScript}>
              Run SQL Update Script
            </Button>
            <Button variant="outline" className="bg-white" onClick={handleManualRefresh}>
              Refresh With Auth
            </Button>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRunSqlScript}
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
              {registrations.length === 0 && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    No registrations found. If you believe records should be present, try clicking the "Refresh Data" button or run the Database Setup script.
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
        onRefreshData={handleManualRefresh}
      />
    </>
  );
}
