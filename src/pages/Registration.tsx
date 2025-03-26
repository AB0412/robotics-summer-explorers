
import React, { useState, useEffect } from 'react';
import RegistrationForm from '@/components/RegistrationForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { validateDatabaseSchema } from '@/utils/database/schema/validation';
import { hasValidCredentials } from '@/utils/supabase/client';

const Registration = () => {
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  useEffect(() => {
    // Check database schema when component loads
    const checkDatabaseSchema = async () => {
      if (!hasValidCredentials()) {
        setDatabaseStatus('invalid');
        return;
      }

      try {
        const isValid = await validateDatabaseSchema();
        setDatabaseStatus(isValid ? 'valid' : 'invalid');
      } catch (error) {
        console.error('Error checking database schema:', error);
        setDatabaseStatus('invalid');
      }
    };

    checkDatabaseSchema();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Summer Robotics Program Registration</h1>
      <p className="text-center text-gray-700 mb-8 max-w-2xl mx-auto">
        Please complete this form to register your child for our Summer Robotics Program. 
        All fields marked as required must be filled in to complete the registration.
      </p>
      
      {databaseStatus === 'invalid' && (
        <Alert className="mb-8 max-w-2xl mx-auto">
          <Info className="h-4 w-4" />
          <AlertTitle>Database Setup Required</AlertTitle>
          <AlertDescription>
            Before using this form, please ensure your Supabase database has a 'registrations' table with the correct schema.
            You can find the SQL script to create the table in the project at:
            <code className="block mt-2 p-2 bg-gray-100 rounded">src/utils/database/create-table.sql</code>
          </AlertDescription>
        </Alert>
      )}
      
      <RegistrationForm />
    </div>
  );
};

export default Registration;
