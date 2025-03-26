
import React, { useEffect } from 'react';
import RegistrationForm from '@/components/registration/RegistrationForm';

const Registration = () => {
  useEffect(() => {
    console.log("Registration page mounted");
    document.title = "Registration - Robotics Summer Explorers";
  }, []);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-6 text-robotics-navy">
        Summer Robotics Program Registration
      </h1>
      <p className="text-gray-600 mb-8">
        Complete the form below to register your child for our exciting summer robotics program. 
        Fields marked with an asterisk (*) are required.
      </p>
      
      <RegistrationForm />
    </div>
  );
};

export default Registration;
