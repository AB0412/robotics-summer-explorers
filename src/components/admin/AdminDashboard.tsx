
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardToolbar } from './DashboardToolbar';
import { RegistrationsTable } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Button } from '@/components/ui/button';
import { Database, RefreshCw, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { SchemaUpdateModal } from './SchemaUpdateModal';
import { validateDatabaseSchema } from '@/utils/database/schema-utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { checkRLSPolicies, fixRLSPolicies } from '@/utils/supabase/rls-helpers';
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
  const [rlsStatus, setRlsStatus] = useState<{success: boolean; message: string} | null>(null);
  const [authStatus, setAuthStatus] = useState<string | null>(null);
  const [isFixingRLS, setIsFixingRLS] = useState(false);

  // Check if schema needs updating, auth status, and RLS policies
  useEffect(() => {
    const initialize = async () => {
      try {
        // Check schema validity
        const isValid = await validateDatabaseSchema();
        setNeedsSchemaUpdate(!isValid);
        
        // Check authentication status
        const { data } = await supabase.auth.getSession();
        setAuthStatus(data.session ? 'authenticated' : 'unauthenticated');
        
        if (!data.session) {
          console.log('User is not authenticated, attempting anonymous sign-in');
          try {
            const { error } = await supabase.auth.signInAnonymously();
            if (error) {
              console.error('Anonymous sign-in failed:', error);
              toast({
                title: "Authentication Error",
                description: `Failed to sign in anonymously: ${error.message}`,
                variant: "destructive",
              });
            } else {
              setAuthStatus('authenticated (anon)');
              // Reload registrations after authentication
              loadRegistrations();
            }
          } catch (err) {
            console.error('Auth error:', err);
          }
        }
        
        // Check RLS policies
        const rlsCheck = await checkRLSPolicies();
        setRlsStatus(rlsCheck);
        setShowRlsAlert(!rlsCheck.success);
        
        if (rlsCheck.success) {
          toast({
            title: "Database Connection Successful",
            description: rlsCheck.message,
          });
        } else {
          toast({
            title: "Database Access Issues",
            description: rlsCheck.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Initialization error:', error);
        toast({
          title: "Initialization Error",
          description: error instanceof Error ? error.message : "Unknown error during initialization",
          variant: "destructive",
        });
      }
    };
    
    initialize();
  }, [loadRegistrations, toast]);

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
      // First try to authenticate if needed
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        const { error: signInError } = await supabase.auth.signInAnonymously();
        if (signInError) {
          console.error('Sign in error:', signInError);
          toast({
            title: "Authentication Error",
            description: `Could not authenticate: ${signInError.message}`,
            variant: "destructive",
          });
        } else {
          setAuthStatus('authenticated (anon)');
        }
      }
      
      // Now try to load registrations
      await loadRegistrations();
      
      // Check RLS status again
      const rlsCheck = await checkRLSPolicies();
      setRlsStatus(rlsCheck);
      setShowRlsAlert(!rlsCheck.success);
      
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
        setShowRlsAlert(false);
        setRlsStatus({
          success: true,
          message: result.message
        });
        
        // Reload registrations after fixing RLS
        await loadRegistrations();
        
        toast({
          title: "RLS Issues Fixed",
          description: result.message,
        });
      } else {
        setRlsStatus({
          success: false,
          message: result.message
        });
        
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
        <Alert className={`mb-4 ${authStatus.includes('authenticated') ? 'bg-blue-50' : 'bg-yellow-50'}`}>
          <Database className={`h-4 w-4 ${authStatus.includes('authenticated') ? 'text-blue-500' : 'text-yellow-500'} mr-2`} />
          <AlertDescription className={authStatus.includes('authenticated') ? 'text-blue-700' : 'text-yellow-700'}>
            Authentication status: {authStatus}. {authStatus === 'unauthenticated' && 
              "You may need to refresh the page to access data."}
          </AlertDescription>
        </Alert>
      )}
      
      {rlsStatus && (
        <Alert className={`mb-4 ${rlsStatus.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          {rlsStatus.success ? 
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" /> : 
            <ShieldAlert className="h-4 w-4 text-yellow-500 mr-2" />
          }
          <AlertDescription className={`flex justify-between items-center ${rlsStatus.success ? 'text-green-700' : 'text-yellow-700'}`}>
            <span>{rlsStatus.message}</span>
            {!rlsStatus.success && (
              <Button 
                variant="outline" 
                className="ml-4 bg-white" 
                onClick={handleFixRLS}
                disabled={isFixingRLS}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isFixingRLS ? 'animate-spin' : ''}`} />
                {isFixingRLS ? 'Fixing...' : 'Fix RLS Issues'}
              </Button>
            )}
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
