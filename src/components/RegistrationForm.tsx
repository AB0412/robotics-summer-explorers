
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
import { formSchema, FormValues } from './registration/RegistrationTypes';
import { Mail, Send } from 'lucide-react';

const generateRegistrationId = () => {
  return 'REG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const RegistrationForm = () => {
  const { toast } = useToast();

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
      // We're simulating success for now
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
    console.log('Form submitted:', data);
    
    // Generate a unique registration ID
    const registrationId = generateRegistrationId();
    
    // Save to localStorage with registration ID
    const existingRegistrations = localStorage.getItem('registrations');
    let registrationsArray = [];
    
    if (existingRegistrations) {
      registrationsArray = JSON.parse(existingRegistrations);
    }
    
    // Add registration ID and timestamp to registration
    const registrationWithIdAndTimestamp = {
      ...data,
      registrationId,
      submittedAt: new Date().toISOString()
    };
    
    registrationsArray.push(registrationWithIdAndTimestamp);
    localStorage.setItem('registrations', JSON.stringify(registrationsArray));
    
    // Send confirmation email
    const emailSent = await sendConfirmationEmail(data, registrationId);
    
    // Show success toast with additional information including registration ID
    toast({
      title: "Registration Submitted",
      description: `Your registration ID is: ${registrationId}. ${emailSent ? 'A confirmation email has been sent to your email address.' : ''} Thank you for registering! Please check your email for confirmation. Remember to bring a laptop or tablet if available for take-home assignments.`,
      duration: 8000, // Extended duration for longer message
    });
    
    // Reset form
    form.reset();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
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
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy flex items-center justify-center gap-2"
          >
            <Send className="h-4 w-4" />
            Submit Registration
          </Button>
          <p className="text-sm text-gray-500 text-center mt-2">
            <Mail className="inline h-4 w-4 mr-1" />
            A confirmation email will be sent upon successful registration
          </p>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
