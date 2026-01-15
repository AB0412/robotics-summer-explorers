import React, { useEffect, useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { initializeDatabase, hasValidCredentials } from '@/utils/supabase/client';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasValidDb, setHasValidDb] = useState(false);
  // Add state to track if we've already initialized to prevent double toasts
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Only run initialization once
    if (!hasInitialized) {
      const init = async () => {
        try {
          await initializeDatabase();
          const valid = hasValidCredentials();
          setHasValidDb(valid);

          // Drive "authenticated" UI state from the real auth session (not sessionStorage)
          const { data } = await supabase.auth.getSession();
          setIsAuthenticated(!!data.session);

          const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
          });
          unsubscribe = () => listener.subscription.unsubscribe();
        } catch (error) {
          console.error('Failed to initialize database:', error);
          setHasValidDb(false);
        } finally {
          setIsInitializing(false);
          setHasInitialized(true);
        }
      };

      init();
    }

    return () => {
      unsubscribe?.();
    };
  }, [hasInitialized]);

  const handleAuthentication = async () => {
    // AdminLogin completes a real sign-in; confirm we actually have a session.
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
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
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {!isAuthenticated ? (
        <AdminLogin onLogin={handleAuthentication} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Admin;
