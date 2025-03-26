
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import RegistrationForm from '@/components/registration/RegistrationForm';

const Registration = () => {
  useEffect(() => {
    console.log("Registration page component mounted");
    
    // Log the document title and URL to diagnose loading issues
    console.log("Document title:", document.title);
    console.log("Current URL:", window.location.href);
    console.log("Path:", window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-6 text-robotics-navy">
          Summer Robotics Program Registration
        </h1>
        <p className="text-gray-600 mb-8">
          Complete the form below to register your child for our exciting summer robotics program. 
          Fields marked with an asterisk (*) are required.
        </p>
        
        <RegistrationForm />
      </main>
      <footer className="bg-robotics-navy text-white py-8">
        <div className="container text-center">
          <p>© 2024 Robotics Summer Explorers. All rights reserved.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Registration;
