
import React, { useState, useEffect } from 'react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is already authenticated in this session
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuthentication = () => {
    setIsAuthenticated(true);
    // Store authentication status in session storage
    sessionStorage.setItem('adminAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuthenticated');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {!isAuthenticated ? (
        <AdminLogin onLogin={handleAuthentication} />
      ) : (
        <>
          <Alert className="mb-4 bg-blue-50">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertDescription className="text-blue-700">
              You can import and export registration data using the buttons above the table. 
              To share registrations between devices, export the data file and share it with other administrators.
            </AlertDescription>
          </Alert>
          <AdminDashboard onLogout={handleLogout} />
        </>
      )}
    </div>
  );
};

export default Admin;
