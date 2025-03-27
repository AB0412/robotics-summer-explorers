
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  databaseError,
  isCheckingDatabase,
  checkDatabase,
}: DatabaseFeedbackProps) => {
  // Add local state to prevent flickering alerts
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Use effect to debounce error display
  useEffect(() => {
    if (databaseError) {
      // Set the error message immediately
      setErrorMessage(databaseError);
      
      // Only show the error alert if it persists for 1 second
      const timer = setTimeout(() => {
        setShowError(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Clear the error after a short delay
      const timer = setTimeout(() => {
        setShowError(false);
        
        // Clear the message after the fade animation would complete
        setTimeout(() => {
          setErrorMessage(null);
        }, 300);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [databaseError]);

  return (
    <>
      {showError && errorMessage && (
        <Alert variant="destructive" className="mb-6 transition-opacity duration-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex justify-between items-center">
            <span>{errorMessage}</span>
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
    </>
  );
};

export default DatabaseFeedback;
