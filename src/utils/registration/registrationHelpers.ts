
import { FormValues } from '@/components/registration/RegistrationTypes';
import { supabase, REGISTRATIONS_TABLE } from '@/utils/supabase/client';
import { toast } from '@/hooks/use-toast';
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

// Submit registration to database
export const submitRegistration = async (registrationData: Registration) => {
  try {
    console.log('Submitting registration to database:', registrationData);
    
    // Direct approach using supabase client for better error handling
    const { error: directError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(registrationData);
      
    if (directError) {
      console.error('Direct submission error:', directError);
      throw new Error(`Database error: ${directError.message}`);
    }
    
    console.log('Registration successfully saved to database');
    return { success: true, error: null };
  } catch (error) {
    console.error('Error during registration submission:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown database error' 
    };
  }
};
