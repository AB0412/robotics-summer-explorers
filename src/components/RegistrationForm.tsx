
import React from 'react';
import { Form } from '@/components/ui/form';
import BasicInfoSection from './registration/BasicInfoSection';
import ChildDetailsSection from './registration/ChildDetailsSection';
import ProgramTypeSection from './registration/ProgramTypeSection';
import ProgramPreferencesSection from './registration/ProgramPreferencesSection';
import RoboticsExperienceSection from './registration/RoboticsExperienceSection';
import LogisticsConsentSection from './registration/LogisticsConsentSection';
import PaymentOptionsSection from './registration/PaymentOptionsSection';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import SubmitButton from './registration/SubmitButton';

const RegistrationForm = () => {
  const { form, registrationId, isSubmitting, onSubmit } = useRegistrationForm();
  
  // No need for database validation checks - RLS policies handle anonymous registration
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Information */}
          <BasicInfoSection form={form} />
          
          {/* Section 2: Child Details */}
          <ChildDetailsSection form={form} />
          
          {/* Section 3: Program Type */}
          <ProgramTypeSection form={form} />
          
          {/* Section 4: Program Preferences */}
          <ProgramPreferencesSection form={form} />
          
          {/* Section 5: Robotics Experience */}
          <RoboticsExperienceSection form={form} />
          
          {/* Section 6: Logistics & Consent */}
          <LogisticsConsentSection form={form} />
          
          {/* Section 7: Payment Options */}
          <PaymentOptionsSection form={form} />
          
          {/* Submit Button */}
          <SubmitButton 
            isSubmitting={isSubmitting}
            hasValidCredentials={true}
            databaseReady={true}
          />
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
