
import { FormValues } from '@/components/registration/RegistrationTypes';
import { Registration } from '@/utils/database';
import { supabase } from '@/utils/supabase/client';

// Generate a unique registration ID
export const generateRegistrationId = () => {
  return 'REG-' + Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Send confirmation email using our Supabase Edge Function
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

    console.log("Sending confirmation email to:", data.parentEmail);
    
    // Call our Supabase Edge Function to send emails
    const { data: emailResponse, error } = await supabase.functions.invoke('send-registration-email', {
      body: JSON.stringify({
        parentEmail: data.parentEmail,
        parentName: data.parentName,
        childName: data.childName,
        registrationId: registrationId,
        preferredBatch: data.preferredBatch,
        registrationSummary: registrationSummary
      })
    });

    if (error) {
      console.error("Error calling email function:", error);
      return false;
    }
    
    console.log("Email function response:", emailResponse);
    return emailResponse.success;
    
  } catch (error) {
    console.error("Email sending failed:", error);
    return false;
  }
};
