
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { registrationSchema, RegistrationData } from './types';
import ParentInfoSection from './ParentInfoSection';
import ChildDetailsSection from './ChildDetailsSection';
import ProgramPreferencesSection from './ProgramPreferencesSection';
import RoboticsExperienceSection from './RoboticsExperienceSection';
import LogisticsSection from './LogisticsSection';
import AdditionalInfoSection from './AdditionalInfoSection';

const RegistrationForm = () => {
  const { toast } = useToast();
  const [showExperienceDetails, setShowExperienceDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContact: '',
      childName: '',
      childAge: undefined,
      grade: '',
      schoolName: '',
      medicalInfo: '',
      preferredTiming: '12:00 PM – 1:30 PM',
      alternateTiming: '',
      priorExperience: 'no',
      experienceDetails: '',
      interestLevel: '3',
      referralSource: '',
      photoConsent: false,
      waiverAgreement: false,
      tshirtSize: '',
      specialRequests: '',
      volunteerInterest: false,
    },
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // Get existing registrations from localStorage
      const existingData = localStorage.getItem('registrations');
      const registrations = existingData ? JSON.parse(existingData) : [];
      
      // Add unique ID to the registration
      const newRegistration = {
        ...data,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString(),
      };
      
      // Add new registration and save back to localStorage
      registrations.push(newRegistration);
      localStorage.setItem('registrations', JSON.stringify(registrations));
      
      // Simulate sending confirmation email
      console.log('Sending confirmation email to:', data.parentEmail);
      
      // Show success toast
      toast({
        title: "Registration Successful",
        description: `Thank you for registering ${data.childName}. A confirmation email has been sent to ${data.parentEmail}.`,
      });
      
      // Reset form
      form.reset();
      setShowExperienceDetails(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg mb-10">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Parent/Guardian Information */}
            <ParentInfoSection form={form} />
            
            {/* Child Details */}
            <ChildDetailsSection form={form} />
            
            {/* Program Preferences */}
            <ProgramPreferencesSection form={form} />
            
            {/* Robotics Experience */}
            <RoboticsExperienceSection 
              form={form} 
              showExperienceDetails={showExperienceDetails}
              setShowExperienceDetails={setShowExperienceDetails}
            />
            
            {/* Logistics & Consent */}
            <LogisticsSection form={form} />
            
            {/* Additional Information */}
            <AdditionalInfoSection form={form} />

            <div className="border-t pt-6 flex justify-center">
              <Button 
                type="submit" 
                className="bg-robotics-accent hover:bg-robotics-lightblue text-white px-8 py-2 rounded-md text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register Now"}
              </Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-bold text-robotics-navy mb-2">What to Bring:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Laptop or tablet (if available) for take-home assignments</li>
                <li>Water bottle</li>
                <li>Enthusiasm and creativity!</li>
              </ul>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
