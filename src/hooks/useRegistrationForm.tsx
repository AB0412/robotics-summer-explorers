
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValues, formSchema } from '@/components/registration/RegistrationTypes';
import { useToast } from '@/hooks/use-toast';
import { 
  generateRegistrationId, 
  sendConfirmationEmail
} from '@/utils/registration/registrationHelpers';
import { Registration } from '@/utils/database/types';
import { hasValidCredentials } from '@/utils/supabase/client';
import { addRegistration } from '@/utils/database/operations/addRegistration';

export const useRegistrationForm = () => {
  const { toast } = useToast();
  const [registrationId, setRegistrationId] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

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
      programType: undefined,
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
    console.log('Form submitted with data:', data);
    
    try {
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
        medicalInfo: data.medicalInfo || '',
        programType: data.programType,
        preferredBatch: data.preferredBatch,
        alternateBatch: data.alternateBatch || '',
        hasPriorExperience: data.hasPriorExperience,
        experienceDescription: data.experienceDescription || '',
        interestLevel: data.interestLevel || '',
        referralSource: data.referralSource,
        photoConsent: data.photoConsent,
        waiverAgreement: data.waiverAgreement,
        tShirtSize: data.tShirtSize || '',
        specialRequests: data.specialRequests || '',
        volunteerInterest: data.volunteerInterest
      };
      
      console.log('Prepared registration data:', registrationWithIdAndTimestamp);
      
      // Submit registration to database
      const result = await addRegistration(registrationWithIdAndTimestamp);
      
      if (!result.success) {
        console.error('Failed to submit registration to database:', result.error);
        toast({
          title: "Registration Error",
          description: result.error || "Could not save your registration to the database.",
          variant: "destructive",
          duration: 8000,
        });
        throw new Error(result.error || 'Failed to submit registration to database');
      }
      
      // Set registration ID for display
      setRegistrationId(newRegistrationId);
      
      // Show success toast with the registration ID
      toast({
        title: "Registration Submitted Successfully",
        description: `Your registration has been submitted successfully! Your registration ID is: ${newRegistrationId}`,
        duration: 8000,
      });
      
      // Send confirmation email to both parent and admin (billoreavinash12@gmail.com)
      try {
        await sendConfirmationEmail(registrationWithIdAndTimestamp);
        console.log('Confirmation email sent successfully to both parent and admin');
        
        // Show additional toast confirming email was sent
        toast({
          title: "Confirmation Email Sent",
          description: "Confirmation emails have been sent to both the parent and administrator.",
          duration: 5000,
        });
      } catch (emailError) {
        console.error('Email sending failed, but registration was saved:', emailError);
        // Don't throw here - registration was successful, email is secondary
        toast({
          title: "Registration Saved",
          description: "Registration was saved successfully, but there was an issue sending the confirmation email.",
          variant: "destructive",
          duration: 6000,
        });
      }
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error during registration submission:', error);
      toast({
        title: "Registration Error",
        description: error instanceof Error ? error.message : "There was a problem submitting your registration. Please try again.",
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    registrationId,
    isSubmitting,
    onSubmit
  };
};
