
import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Database, AlertTriangle } from 'lucide-react';
import { initializeDatabase, hasValidCredentials } from '@/utils/supabase/client';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasValidDb, setHasValidDb] = useState(false);
  // Add state to track if we've already initialized to prevent double toasts
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    // Only run initialization once
    if (!hasInitialized) {
      const init = async () => {
        try {
          await initializeDatabase();
          const valid = hasValidCredentials();
          setHasValidDb(valid);
        } catch (error) {
          console.error("Failed to initialize database:", error);
          setHasValidDb(false);
        } finally {
          setIsInitializing(false);
          setHasInitialized(true);
        }
      };
      
      init();
    }
    
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, [hasInitialized]);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    // Store authentication status in session storage
    sessionStorage.setItem('adminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
  };

  if (isInitializing) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Connecting to database...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Database className="h-6 w-6" />
        Admin Dashboard
      </h1>
      
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleAuthentication} />
      ) : (
        <>
          {!hasValidDb ? (
            <Alert className="mb-4 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-700" />
              <AlertDescription className="text-yellow-700">
                Database configuration required. Please configure your Supabase credentials to use the admin features.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-4 bg-blue-50">
              <Info className="h-4 w-4 text-blue-700" />
              <AlertDescription className="text-blue-700">
                Your registration data is stored in Supabase. All administrators can access the same data from anywhere.
                You can export/import data using the buttons above the table.
              </AlertDescription>
            </Alert>
          )}
          <AdminDashboard onLogout={handleLogout} />
        </>
      )}
    </div>
  );
};

export default Admin;
