import React, { useEffect, useState } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { hasValidCredentials } from '@/utils/supabase/client';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasValidDb, setHasValidDb] = useState(false);

  useEffect(() => {
    const valid = hasValidCredentials();
    setHasValidDb(valid);

    // Check current session with a timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.warn('Auth session check timed out');
      setIsInitializing(false);
    }, 5000);

    supabase.auth.getSession()
      .then(({ data }) => {
        clearTimeout(timeout);
        setIsAuthenticated(!!data.session);
        setIsInitializing(false);
      })
      .catch((err) => {
        clearTimeout(timeout);
        console.error('Failed to get session:', err);
        setIsInitializing(false);
      });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (isInitializing) setIsInitializing(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuthentication = async () => {
    // AdminLogin completes a real sign-in; confirm we actually have a session.
    const { data } = await supabase.auth.getSession();
    setIsAuthenticated(!!data.session);
    setIsInitializing(false);
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
