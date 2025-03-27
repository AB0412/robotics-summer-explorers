
import React from 'react';
import { Form } from '@/components/ui/form';
import BasicInfoSection from './registration/BasicInfoSection';
import ChildDetailsSection from './registration/ChildDetailsSection';
import ProgramPreferencesSection from './registration/ProgramPreferencesSection';
import RoboticsExperienceSection from './registration/RoboticsExperienceSection';
import LogisticsConsentSection from './registration/LogisticsConsentSection';
import PaymentOptionsSection from './registration/PaymentOptionsSection';
import { useRegistrationForm } from '@/hooks/useRegistrationForm';
import { hasValidCredentials } from '@/utils/supabase/client';
import DatabaseFeedback from './registration/DatabaseFeedback';
import SubmitButton from './registration/SubmitButton';
import { useDatabaseConnection } from '@/hooks/useDatabaseConnection';

const RegistrationForm = () => {
  const { form, registrationId, isSubmitting, onSubmit } = useRegistrationForm();
  const { 
    databaseReady,
    databaseError,
    isCheckingDatabase,
    connectionDetails,
    checkDatabase
  } = useDatabaseConnection();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
      <DatabaseFeedback
        databaseReady={databaseReady}
        databaseError={databaseError}
        isCheckingDatabase={isCheckingDatabase}
        checkDatabase={checkDatabase}
        connectionDetails={connectionDetails}
        registrationId={registrationId}
        hasValidCredentials={hasValidCredentials}
      />

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
          <SubmitButton 
            isSubmitting={isSubmitting}
            hasValidCredentials={hasValidCredentials()}
            databaseReady={databaseReady}
          />
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
