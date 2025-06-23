
import { Registration } from '@/utils/database/types';
import { supabase } from '@/integrations/supabase/client';

// Helper function to generate a unique registration ID
export const generateRegistrationId = (): string => {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `REG-${timestamp}-${random}`;
};

// Helper function to validate required fields
export const validateRegistrationData = (data: Partial<Registration>): string[] => {
  const errors: string[] = [];
  
  if (!data.parentName?.trim()) errors.push('Parent name is required');
  if (!data.parentEmail?.trim()) errors.push('Parent email is required');
  if (!data.parentPhone?.trim()) errors.push('Parent phone is required');
  if (!data.emergencyContact?.trim()) errors.push('Emergency contact is required');
  if (!data.childName?.trim()) errors.push('Child name is required');
  if (!data.childAge?.trim()) errors.push('Child age is required');
  if (!data.childGrade?.trim()) errors.push('Child grade is required');
  if (!data.schoolName?.trim()) errors.push('School name is required');
  if (!data.preferredBatch?.trim()) errors.push('Preferred batch is required');
  if (!data.referralSource?.trim()) errors.push('Referral source is required');
  if (!data.hasPriorExperience) errors.push('Prior experience response is required');
  
  return errors;
};

// Helper function to create a complete registration object
export const createCompleteRegistration = (formData: Partial<Registration>): Registration => {
  const registrationId = generateRegistrationId();
  const submittedAt = new Date().toISOString();
  
  return {
    registrationId,
    parentName: formData.parentName || '',
    parentEmail: formData.parentEmail || '',
    parentPhone: formData.parentPhone || '',
    emergencyContact: formData.emergencyContact || '',
    childName: formData.childName || '',
    childAge: formData.childAge || '',
    childGrade: formData.childGrade || '',
    schoolName: formData.schoolName || '',
    medicalInfo: formData.medicalInfo || '',
    programType: formData.programType || 'regular', // Updated default to 'regular'
    preferredBatch: formData.preferredBatch || '',
    alternateBatch: formData.alternateBatch || '',
    hasPriorExperience: formData.hasPriorExperience || 'no',
    experienceDescription: formData.experienceDescription || '',
    interestLevel: formData.interestLevel || '',
    referralSource: formData.referralSource || '',
    photoConsent: formData.photoConsent || false,
    waiverAgreement: formData.waiverAgreement || false,
    tShirtSize: formData.tShirtSize || '',
    specialRequests: formData.specialRequests || '',
    volunteerInterest: formData.volunteerInterest || false,
    submittedAt,
  };
};

// Helper function to format registration data for display
export const formatRegistrationForDisplay = (registration: Registration) => {
  return {
    id: registration.registrationId,
    parentInfo: `${registration.parentName} (${registration.parentEmail})`,
    childInfo: `${registration.childName}, Age ${registration.childAge}, Grade ${registration.childGrade}`,
    school: registration.schoolName,
    preferredBatch: registration.preferredBatch,
    submittedAt: new Date(registration.submittedAt).toLocaleDateString(),
  };
};

// Helper function to create registration summary for email
const createRegistrationSummary = (registration: Registration): string => {
  return `
Registration ID: ${registration.registrationId}
Submitted: ${new Date(registration.submittedAt).toLocaleString()}

PARENT INFORMATION:
Name: ${registration.parentName}
Email: ${registration.parentEmail}
Phone: ${registration.parentPhone}
Emergency Contact: ${registration.emergencyContact}

CHILD INFORMATION:
Name: ${registration.childName}
Age: ${registration.childAge}
Grade: ${registration.childGrade}
School: ${registration.schoolName}
Medical Info: ${registration.medicalInfo || 'None provided'}

PROGRAM DETAILS:
Program Type: ${registration.programType}
Preferred Batch: ${registration.preferredBatch}
Alternate Batch: ${registration.alternateBatch || 'None'}
Prior Experience: ${registration.hasPriorExperience}
Experience Description: ${registration.experienceDescription || 'None provided'}
Interest Level: ${registration.interestLevel || 'Not specified'}
Referral Source: ${registration.referralSource}

ADDITIONAL INFORMATION:
T-Shirt Size: ${registration.tShirtSize || 'Not specified'}
Special Requests: ${registration.specialRequests || 'None'}
Photo Consent: ${registration.photoConsent ? 'Yes' : 'No'}
Waiver Agreement: ${registration.waiverAgreement ? 'Yes' : 'No'}
Volunteer Interest: ${registration.volunteerInterest ? 'Yes' : 'No'}
  `.trim();
};

// Send confirmation email using the edge function
export const sendConfirmationEmail = async (registration: Registration): Promise<void> => {
  try {
    console.log('Sending confirmation email for registration:', registration.registrationId);
    
    const registrationSummary = createRegistrationSummary(registration);
    
    const { data, error } = await supabase.functions.invoke('send-registration-email', {
      body: {
        parentEmail: registration.parentEmail,
        parentName: registration.parentName,
        childName: registration.childName,
        registrationId: registration.registrationId,
        preferredBatch: registration.preferredBatch,
        registrationSummary: registrationSummary
      }
    });

    if (error) {
      console.error('Error calling email function:', error);
      throw new Error(`Failed to send confirmation email: ${error.message}`);
    }

    console.log('Email function response:', data);
    console.log(`Confirmation emails sent to: ${registration.parentEmail} and billoreavinash12@gmail.com`);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw new Error('Failed to send confirmation email');
  }
};
