import { Registration } from '@/types/schedule';
import { formatRegistrationData } from '@/utils/database/core';
import { addRegistration } from '@/utils/database/operations/addRegistration';
import { supabase } from '@/integrations/supabase/client';

/**
 * Processes a registration form submission.
 * @param {Registration} registration - The registration data to be submitted.
 * @returns {Promise<boolean>} - A promise that resolves to true if the submission was successful, false otherwise.
 */
export const submitRegistration = async (registration: Registration): Promise<boolean> => {
  try {
    // Format the registration data to match the database schema
    const formattedRegistration = formatRegistrationData(registration);

    // Add the registration to the database
    const success = await addRegistration(formattedRegistration);

    if (success) {
      console.log('Registration submitted successfully!');
      return true;
    } else {
      console.error('Failed to submit registration.');
      return false;
    }
  } catch (error) {
    console.error('Error submitting registration:', error);
    return false;
  }
};

/**
 * Generates a unique registration ID.
 * @returns {string} - A unique registration ID.
 */
export const generateRegistrationId = (): string => {
  const timestamp = Date.now().toString(36); // Convert timestamp to base36
  const randomString = Math.random().toString(36).substring(2, 8); // Get a random string

  return `${timestamp}-${randomString}`.toUpperCase(); // Combine and format the ID
};

/**
 * Uploads a file to Supabase storage.
 * @param {File} file - The file to upload.
 * @param {string} filePath - The path in Supabase storage where the file should be stored.
 * @returns {Promise<string | null>} - A promise that resolves to the public URL of the uploaded file, or null if the upload failed.
 */
export const uploadFile = async (file: File, filePath: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('uploads') // Replace 'uploads' with your storage bucket name
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: publicUrlData } = supabase.storage
      .from('uploads') // Replace 'uploads' with your storage bucket name
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};
