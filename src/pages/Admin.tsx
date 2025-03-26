
import React from 'react';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import RegistrationSearch from '@/components/RegistrationSearch';

const Admin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-6 text-robotics-navy">
          Registration Management
        </h1>
        <p className="text-gray-600 mb-8">
          View and search through all registrations for the summer robotics program.
        </p>
        
        <RegistrationSearch />
      </main>
      <footer className="bg-robotics-navy text-white py-8">
        <div className="container text-center">
          <p>© 2025 Robotics Summer Explorers. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Admin;
