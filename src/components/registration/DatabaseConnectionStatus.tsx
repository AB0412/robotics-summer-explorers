
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Database, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DatabaseConnectionStatusProps {
  connectionDetails: any;
  errorMessage: string | null;
  isRunningPermissionCheck: boolean;
  handleFixPermissions: () => Promise<void>;
}

const DatabaseConnectionStatus = ({
  connectionDetails,
  errorMessage,
  isRunningPermissionCheck,
  handleFixPermissions
}: DatabaseConnectionStatusProps) => {
  return (
    <>
      {connectionDetails && (
        <Alert className={`mb-6 ${connectionDetails.connected ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
          {connectionDetails.connected ? 
            <CheckCircle2 className="h-4 w-4 text-green-700" /> : 
            <AlertTriangle className="h-4 w-4 text-yellow-700" />
          }
          <AlertDescription className={connectionDetails.connected ? 'text-green-700' : 'text-yellow-700'}>
            <div className="font-medium">
              {connectionDetails.connected ? 
                'Database Connection: Successful' : 
                'Database Connection: Failed'
              }
            </div>
            {connectionDetails.permissions && (
              <div className="mt-2">
                <div>Permissions:</div>
                <ul className="list-disc pl-5 mt-1">
                  <li>Read Access: {connectionDetails.permissions.read ? 'Yes ✓' : 'No ✗'}</li>
                  <li>Write Access: {connectionDetails.permissions.write ? 'Yes ✓' : 'No ✗'}</li>
                  <li>Execute SQL: {connectionDetails.permissions.execute ? 'Yes ✓' : 'No ✗'}</li>
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {errorMessage && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200">
          <AlertTriangle className="h-4 w-4 text-yellow-700" />
          <AlertDescription className="text-yellow-700 flex justify-between items-center">
            <span>{errorMessage}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleFixPermissions}
              disabled={isRunningPermissionCheck}
              className="ml-4"
            >
              <Database className={`h-4 w-4 mr-2 ${isRunningPermissionCheck ? 'animate-spin' : ''}`} />
              {isRunningPermissionCheck ? 'Fixing...' : 'Fix Permissions'}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DatabaseConnectionStatus;
