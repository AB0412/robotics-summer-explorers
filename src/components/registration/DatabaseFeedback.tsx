
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DatabaseAlerts from './DatabaseAlerts';

interface DatabaseFeedbackProps {
  databaseReady: boolean | null;
  databaseError: string | null;
  isCheckingDatabase: boolean;
  checkDatabase: () => Promise<void>;
  connectionDetails: any;
  registrationId: string | null;
  hasValidCredentials: () => boolean;
}

const DatabaseFeedback = ({
  databaseReady,
  databaseError,
  isCheckingDatabase,
  checkDatabase,
  connectionDetails,
  registrationId,
  hasValidCredentials
}: DatabaseFeedbackProps) => {
  return (
    <>
      <DatabaseAlerts 
        hasValidCredentials={hasValidCredentials()} 
        databaseReady={databaseReady} 
        registrationId={registrationId} 
      />

      {databaseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{databaseError}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={checkDatabase}
              disabled={isCheckingDatabase}
              className="ml-4 whitespace-nowrap"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isCheckingDatabase ? 'animate-spin' : ''}`} />
              {isCheckingDatabase ? 'Checking...' : 'Retry Connection'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {connectionDetails && !connectionDetails.connected && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <Database className="h-4 w-4 text-yellow-700" />
          <AlertDescription className="text-yellow-700">
            <div className="font-medium">Database Permission Details:</div>
            <ul className="list-disc pl-5 mt-2">
              <li>Read Access: {connectionDetails.permissions?.read ? 'Yes ✓' : 'No ✗'}</li>
              <li>Write Access: {connectionDetails.permissions?.write ? 'Yes ✓' : 'No ✗'}</li>
              <li>Execute SQL: {connectionDetails.permissions?.execute ? 'Yes ✓' : 'No ✗'}</li>
            </ul>
            <div className="mt-2 text-sm">
              To fix permission issues, go to the Registration page and click "Fix Permissions" button.
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DatabaseFeedback;
