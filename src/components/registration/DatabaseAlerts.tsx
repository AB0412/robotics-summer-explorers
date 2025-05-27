
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { REGISTRATIONS_TABLE } from '@/utils/supabase/client';

interface DatabaseAlertsProps {
  hasValidCredentials: boolean;
  databaseReady: boolean | null;
  registrationId: string | null;
}

const DatabaseAlerts = ({ 
  hasValidCredentials, 
  databaseReady, 
  registrationId 
}: DatabaseAlertsProps) => {
  return (
    <>
      {!hasValidCredentials && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-700" />
          <AlertTitle className="text-red-800">Database Configuration Required</AlertTitle>
          <AlertDescription className="text-red-700">
            Please configure Supabase credentials to enable registration submissions.
          </AlertDescription>
        </Alert>
      )}
      
      {databaseReady === false && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-700" />
          <AlertTitle className="text-red-800">Database Setup Required</AlertTitle>
          <AlertDescription className="text-red-700">
            Please make sure you have created a '{REGISTRATIONS_TABLE}' table in your Supabase project.
          </AlertDescription>
        </Alert>
      )}
    
      {registrationId && (
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <AlertTriangle className="h-4 w-4 text-blue-700" />
          <AlertTitle className="text-blue-800">Important: Save Your Registration ID</AlertTitle>
          <AlertDescription className="text-blue-700">
            Please write down your registration ID: <strong className="font-bold">{registrationId}</strong>
            <br />
            You will need this ID for any future inquiries about your registration.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DatabaseAlerts;
