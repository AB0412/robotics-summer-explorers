
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { Registration } from './types';
import { toast } from '@/hooks/use-toast';

// Get all registrations
export const getAllRegistrations = async (): Promise<Registration[]> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot load registrations.');
    toast({
      title: "Database Configuration Required",
      description: "Please configure valid Supabase credentials to use this application.",
      variant: "destructive",
    });
    return [];
  }

  try {
    console.log('Attempting to get all registrations from Supabase...');
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error getting registrations:', error);
      toast({
        title: "Data Fetch Error",
        description: "Could not retrieve registrations from the database. Please check your configuration.",
        variant: "destructive",
      });
      return [];
    }
    
    console.log(`Successfully retrieved ${data?.length || 0} registrations from Supabase`);
    return data as Registration[];
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
    return [];
  }
};

// Add a new registration
export const addRegistration = async (registration: Registration): Promise<boolean> => {
  // If no valid Supabase credentials, don't attempt to save
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot add registration.');
    toast({
      title: "Database Configuration Required",
      description: "Please configure valid Supabase credentials to use this application.",
      variant: "destructive",
    });
    return false;
  }

  try {
    console.log('Attempting to add registration to Supabase:', registration);
    
    // Test database connection before trying to insert
    const { error: testError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Database connection test failed:', testError);
      toast({
        title: "Database Connection Failed",
        description: "Could not connect to the database. Please check if the 'registrations' table exists.",
        variant: "destructive",
      });
      return false;
    }
    
    // Proceed with insertion
    const { error, data } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(registration)
      .select();
    
    if (error) {
      console.error('Error adding registration to Supabase:', error);
      let errorMessage = "Could not save your registration to the database.";
      
      // Provide more specific error messages based on error code
      if (error.code === "23505") {
        errorMessage = "A registration with this ID already exists.";
      } else if (error.code === "42P01") {
        errorMessage = "The registrations table doesn't exist in your database.";
      } else if (error.code?.startsWith("23")) {
        errorMessage = "The registration data doesn't match the database schema.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } else {
      console.log('Registration successfully added to Supabase:', data);
      toast({
        title: "Registration Saved",
        description: "Your registration has been successfully saved to the database.",
      });
      return true;
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
    return false;
  }
};

// Delete a registration
export const deleteRegistration = async (registrationId: string): Promise<boolean> => {
  // If no valid Supabase credentials, don't attempt to delete
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot delete registration.');
    toast({
      title: "Database Configuration Required",
      description: "Please configure valid Supabase credentials to use this application.",
      variant: "destructive",
    });
    return false;
  }

  try {
    console.log(`Attempting to delete registration with ID: ${registrationId}`);
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .eq('registrationId', registrationId);
    
    if (error) {
      console.error('Error deleting registration from Supabase:', error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the registration from the database. Please check your configuration.",
        variant: "destructive",
      });
      return false;
    } else {
      console.log(`Successfully deleted registration with ID: ${registrationId}`);
      toast({
        title: "Registration Deleted",
        description: "Registration was successfully deleted from the database.",
      });
      return true;
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
    return false;
  }
};
