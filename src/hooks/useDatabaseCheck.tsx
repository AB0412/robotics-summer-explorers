
import React, { useState, useEffect, useRef } from 'react';
import { validateDatabaseSetup } from '@/utils/database/security/schemaValidation';
import { fixDatabasePermissions } from '@/utils/database/security/rlsOperations';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook to check database health and connectivity
 */
const useDatabaseCheck = () => {
  const { toast } = useToast();
  const [databaseStatus, setDatabaseStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRunningPermissionCheck, setIsRunningPermissionCheck] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState<any>(null);
  
  // Add refs to track initialization and prevent duplicate checks
  const isInitialized = useRef(false);
  const checkInProgress = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (!isInitialized.current) {
      isInitialized.current = true;
      checkDatabaseSchema();
    }
    
    // Cleanup function
    return () => {
      checkInProgress.current = false;
    };
  }, []);

  const checkDatabaseSchema = async () => {
    // Prevent concurrent checks
    if (checkInProgress.current) {
      console.log('Database check already in progress, skipping duplicate check');
      return;
    }
    
    try {
      console.log('Validating database schema...');
      setDatabaseStatus('checking');
      checkInProgress.current = true;
      
      const validationResult = await validateDatabaseSetup();
      setConnectionDetails(validationResult.connectionDetails);
      
      if (!validationResult.isValid) {
        setDatabaseStatus('invalid');
        setErrorMessage(validationResult.error || 'Unknown validation error');
        checkInProgress.current = false;
        return;
      }
      
      setDatabaseStatus('valid');
      setErrorMessage(null);
    } catch (error) {
      console.error('Error in database check:', error);
      setDatabaseStatus('invalid');
      setErrorMessage(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      checkInProgress.current = false;
    }
  };

  const handleFixPermissions = async () => {
    // Prevent multiple concurrent fix attempts
    if (isRunningPermissionCheck) {
      return;
    }
    
    setIsRunningPermissionCheck(true);
    try {
      const result = await fixDatabasePermissions();
      
      if (result.success) {
        setDatabaseStatus('valid');
        setErrorMessage(null);
        
        // Run validation again to update connection details
        const validationResult = await validateDatabaseSetup();
        setConnectionDetails(validationResult.connectionDetails);
        
        toast({
          title: "Success",
          description: "Database permissions fixed successfully!",
        });
      } else {
        setErrorMessage(`Failed to fix permissions: ${result.message}`);
        
        toast({
          title: "Error",
          description: `Failed to fix permissions: ${result.message}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fixing permissions:', error);
      setErrorMessage(`Error fixing permissions: ${error instanceof Error ? error.message : String(error)}`);
      
      toast({
        title: "Error",
        description: `Error fixing permissions: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setIsRunningPermissionCheck(false);
    }
  };

  return {
    databaseStatus,
    errorMessage,
    isRunningPermissionCheck,
    connectionDetails,
    checkDatabaseSchema,
    handleFixPermissions
  };
};

export default useDatabaseCheck;
