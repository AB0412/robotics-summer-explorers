
import React from 'react';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import RegistrationForm from '@/components/RegistrationForm';

const Registration = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="font-display font-bold text-3xl md:text-4xl mb-6 text-robotics-navy text-center">
          Summer Robotics Program Registration
        </h1>
        <p className="text-center mb-8 max-w-2xl mx-auto text-gray-600">
          Please complete the form below to register your child for our 8-week robotics summer program.
          Limited spots available, register early!
        </p>
        
        <RegistrationForm />
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

export default Registration;
