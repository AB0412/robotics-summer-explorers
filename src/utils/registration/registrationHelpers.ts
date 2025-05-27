
import { Registration } from '@/utils/database/types';

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

// Send confirmation email function
export const sendConfirmationEmail = async (formData: any, registrationId: string): Promise<void> => {
  try {
    // This is a placeholder function for sending confirmation emails
    // In a real implementation, this would call an API endpoint or email service
    console.log('Sending confirmation email to:', formData.parentEmail);
    console.log('Registration ID:', registrationId);
    
    // For now, we'll just log the confirmation
    // In production, you would integrate with an email service like Resend
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error here as it shouldn't block registration submission
  }
};
