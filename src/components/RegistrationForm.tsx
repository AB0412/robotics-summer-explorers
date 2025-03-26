
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import BasicInfoSection from './registration/BasicInfoSection';
import ChildDetailsSection from './registration/ChildDetailsSection';
import ProgramPreferencesSection from './registration/ProgramPreferencesSection';
import { formSchema, FormValues } from './registration/RegistrationTypes';

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
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    
    // Show success toast
    toast({
      title: "Registration Submitted",
      description: "Thank you for your registration!",
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
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy"
          >
            Submit Registration
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
