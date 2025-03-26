
import { FormValues } from '@/components/registration/RegistrationTypes';
import { Registration } from '@/utils/database';

// Generate a unique registration ID
export const generateRegistrationId = () => {
  return 'REG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Send confirmation email (simulation for demo purposes)
export const sendConfirmationEmail = async (data: FormValues, registrationId: string) => {
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
    return true;
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};
