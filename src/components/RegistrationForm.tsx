
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import BasicInfoSection from './registration/BasicInfoSection';
import ChildDetailsSection from './registration/ChildDetailsSection';
import ProgramPreferencesSection from './registration/ProgramPreferencesSection';
import RoboticsExperienceSection from './registration/RoboticsExperienceSection';
import LogisticsConsentSection from './registration/LogisticsConsentSection';
import PaymentOptionsSection from './registration/PaymentOptionsSection';
import { formSchema, FormValues } from './registration/RegistrationTypes';
import { Send, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { addRegistration, Registration } from '@/utils/database';
import { hasValidCredentials, initializeDatabase, supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';

const generateRegistrationId = () => {
  return 'REG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const RegistrationForm = () => {
  const { toast } = useToast();
  const [registrationId, setRegistrationId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [databaseReady, setDatabaseReady] = React.useState<boolean | null>(null);

  // Initialize database connection
  React.useEffect(() => {
    const checkDatabase = async () => {
      try {
        // Initialize the database
        await initializeDatabase();
        
        // Test if table exists and is accessible
        const { error } = await supabase
          .from(REGISTRATIONS_TABLE)
          .select('count')
          .limit(1);
          
        if (error) {
          console.error('Database check failed:', error);
          setDatabaseReady(false);
          toast({
            title: "Database Issue",
            description: `Please ensure the ${REGISTRATIONS_TABLE} table exists in your Supabase project.`,
            variant: "destructive",
          });
        } else {
          console.log('Database connection successful');
          setDatabaseReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
        setDatabaseReady(false);
      }
    };
    
    checkDatabase();
  }, [toast]);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContact: '',
      childName: '',
      childAge: '',
      childGrade: '',
      schoolName: '',
      medicalInfo: '',
      preferredBatch: '',
      alternateBatch: '',
      hasPriorExperience: 'no',
      experienceDescription: '',
      interestLevel: '',
      referralSource: '',
      photoConsent: false,
      waiverAgreement: false,
      tShirtSize: '',
      specialRequests: '',
      volunteerInterest: false,
    },
  });

  const sendConfirmationEmail = async (data: FormValues, registrationId: string) => {
    try {
      // Create registration summary for the email
      const registrationSummary = `
        Registration ID: ${registrationId}
        Parent: ${data.parentName}
        Email: ${data.parentEmail}
        Phone: ${data.parentPhone}
        Child: ${data.childName}
        Age: ${data.childAge}
        Grade: ${data.childGrade}
        School: ${data.schoolName}
        Preferred Batch: ${data.preferredBatch}
        Alternate Batch: ${data.alternateBatch || 'None'}
        Medical Information: ${data.medicalInfo || 'None provided'}
        Prior Experience: ${data.hasPriorExperience}
        Experience Description: ${data.experienceDescription || 'N/A'}
        Interest Level: ${data.interestLevel}
        T-Shirt Size: ${data.tShirtSize || 'Not selected'}
        Special Requests: ${data.specialRequests || 'None'}
        Volunteer Interest: ${data.volunteerInterest ? 'Yes' : 'No'}
        Photo Consent: ${data.photoConsent ? 'Yes' : 'No'}
      `;

      // In a real app, this would use a server-side API
      // Since we're client-side only, we'll simulate email sending
      console.log("Sending confirmation email to:", data.parentEmail);
      console.log("Registration Summary:", registrationSummary);
      console.log("Also sending notification to: billoreavinash12@gmail.com");
      
      // For a real implementation, you would call a backend API or email service
      toast({
        title: "Email Notification",
        description: "In a production environment, emails would be sent to " + data.parentEmail + " and billoreavinash12@gmail.com",
        duration: 5000,
      });
      
      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  };

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    if (!hasValidCredentials()) {
      toast({
        title: "Database Configuration Required",
        description: "Please configure valid Supabase credentials to submit registrations.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Form submitted:', data);
    
    // Generate a unique registration ID
    const newRegistrationId = generateRegistrationId();
    console.log('Generated registration ID:', newRegistrationId);
    
    // Create a Registration object with required fields explicitly typed
    const registrationWithIdAndTimestamp: Registration = {
      registrationId: newRegistrationId,
      submittedAt: new Date().toISOString(),
      parentName: data.parentName,
      parentEmail: data.parentEmail,
      parentPhone: data.parentPhone,
      emergencyContact: data.emergencyContact,
      childName: data.childName,
      childAge: data.childAge,
      childGrade: data.childGrade,
      schoolName: data.schoolName,
      medicalInfo: data.medicalInfo,
      preferredBatch: data.preferredBatch,
      alternateBatch: data.alternateBatch,
      hasPriorExperience: data.hasPriorExperience,
      experienceDescription: data.experienceDescription,
      interestLevel: data.interestLevel,
      referralSource: data.referralSource,
      photoConsent: data.photoConsent,
      waiverAgreement: data.waiverAgreement,
      tShirtSize: data.tShirtSize,
      specialRequests: data.specialRequests,
      volunteerInterest: data.volunteerInterest
    };
    
    try {
      console.log('Submitting registration to database:', registrationWithIdAndTimestamp);
      
      // Direct approach using supabase client for better error handling
      const { error: directError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .insert(registrationWithIdAndTimestamp);
        
      if (directError) {
        console.error('Direct submission error:', directError);
        throw new Error(`Database error: ${directError.message}`);
      }
      
      // If direct approach succeeded, we proceed with the rest
      console.log('Registration successfully saved to database');
      setRegistrationId(newRegistrationId);
      
      // Show success toast with the updated message about registration ID
      toast({
        title: "Registration Submitted Successfully",
        description: `Please note your unique registration ID for future reference: ${newRegistrationId}`,
        duration: 8000, // Extended duration for longer message
      });
      
      // Send confirmation email
      await sendConfirmationEmail(data, newRegistrationId);
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error during registration submission:', error);
      toast({
        title: "Registration Error",
        description: "There was a problem submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
      {!hasValidCredentials() && (
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
