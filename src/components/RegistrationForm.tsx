
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Send, RefreshCw, Database } from 'lucide-react';
import BasicInfoSection from './registration/BasicInfoSection';
import ChildDetailsSection from './registration/ChildDetailsSection';
import ProgramPreferencesSection from './registration/ProgramPreferencesSection';
import RoboticsExperienceSection from './registration/RoboticsExperienceSection';
import LogisticsConsentSection from './registration/LogisticsConsentSection';
import PaymentOptionsSection from './registration/PaymentOptionsSection';
import DatabaseAlerts from './registration/DatabaseAlerts';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { hasValidCredentials, initializeDatabase, supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { checkDatabaseConnection } from '@/utils/database/schema-utils';

const RegistrationForm = () => {
  const { toast } = useToast();
  const [databaseReady, setDatabaseReady] = React.useState<boolean | null>(null);
  const [databaseError, setDatabaseError] = React.useState<string | null>(null);
  const [isCheckingDatabase, setIsCheckingDatabase] = React.useState(false);
  const [connectionDetails, setConnectionDetails] = React.useState<any>(null);
  const { form, registrationId, isSubmitting, onSubmit } = useRegistrationForm();
  // Add state to track if initial check has been done
  const [initialCheckDone, setInitialCheckDone] = React.useState(false);

  // Initialize database connection
  React.useEffect(() => {
    if (!initialCheckDone) {
      checkDatabase();
    }
  }, [initialCheckDone]);

  const checkDatabase = async () => {
    setIsCheckingDatabase(true);
    try {
      console.log('Starting database check...');
      
      // Ensure authentication
      const { data: authData } = await supabase.auth.getSession();
      if (!authData.session) {
        console.log('No active session, attempting to sign in anonymously...');
        await supabase.auth.signInAnonymously();
      }
      
      // Initialize the database
      await initializeDatabase();
      
      // Check database connection
      const connectionResult = await checkDatabaseConnection();
      setConnectionDetails(connectionResult);
      
      console.log('Connection check result:', connectionResult);
      
      if (!connectionResult.connected) {
        console.error('Database connection failed:', connectionResult.error);
        setDatabaseReady(false);
        setDatabaseError(`Database connection error: ${connectionResult.error || 'Unknown error'}. ${connectionResult.permissions?.read === false ? 'Read permission denied. Please check your Row Level Security (RLS) policies.' : ''}`);
        
        // Only show toast during initial load
        if (!initialCheckDone) {
          toast({
            title: "Database Connection Issue",
            description: `Unable to connect to the database. Please check your Supabase project settings.`,
            variant: "destructive",
          });
        }
        
        setInitialCheckDone(true);
        return;
      }
      
      // Test if table exists and is accessible
      const { error } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('count')
        .limit(1);
        
      if (error) {
        console.error('Database check failed:', error);
        setDatabaseReady(false);
        setDatabaseError(`Database permission error: ${error.message || 'Unknown error'}. Please check your Row Level Security (RLS) policies.`);
        
        // Only show toast during initial load
        if (!initialCheckDone) {
          toast({
            title: "Database Permission Issue",
            description: `Please ensure the ${REGISTRATIONS_TABLE} table has proper RLS policies in your Supabase project.`,
            variant: "destructive",
          });
        }
      } else {
        console.log('Database connection successful');
        setDatabaseReady(true);
        setDatabaseError(null);
        
        // Only show toast during initial load
        if (!initialCheckDone) {
          toast({
            title: "Database Connection Successful",
            description: "Successfully connected to the Supabase database.",
          });
        }
      }
      
      setInitialCheckDone(true);
    } catch (error) {
      console.error('Failed to initialize database:', error);
      setDatabaseReady(false);
      setDatabaseError(error instanceof Error ? error.message : 'Unknown database error');
      setInitialCheckDone(true);
    } finally {
      setIsCheckingDatabase(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Information */}
          <BasicInfoSection form={form} />
          
          {/* Section 2: Child Details */}
          <ChildDetailsSection form={form} />
          
          {/* Section 3: Program Preferences */}
          <ProgramPreferencesSection form={form} />
          
          {/* Section 4: Robotics Experience */}
          <RoboticsExperienceSection form={form} />
          
          {/* Section 5: Logistics & Consent */}
          <LogisticsConsentSection form={form} />
          
          {/* Section 6: Payment Options */}
          <PaymentOptionsSection form={form} />
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy flex items-center justify-center gap-2"
            disabled={isSubmitting || !hasValidCredentials() || databaseReady === false}
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
