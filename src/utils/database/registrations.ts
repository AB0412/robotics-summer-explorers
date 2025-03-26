
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { Registration, DBStorage, emptyDB } from './types';
import { toast } from '@/hooks/use-toast';

// Load all registrations from Supabase
export const loadDatabase = async (): Promise<DBStorage> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot load database.');
    toast({
      title: "Database Configuration Required",
      description: "Please configure valid Supabase credentials to use this application.",
      variant: "destructive",
    });
    return emptyDB;
  }

  try {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error loading registrations from Supabase:', error);
      toast({
        title: "Database Error",
        description: "Could not load registrations from the database. Please check your configuration.",
        variant: "destructive",
      });
      return emptyDB;
    }
    
    return {
      registrations: data as Registration[]
    };
  } catch (error) {
    console.error('Error accessing Supabase database:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
    return emptyDB;
  }
};

// Save the entire database
export const saveDatabase = async (db: DBStorage): Promise<void> => {
  // If no valid Supabase credentials, don't attempt to save
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot save database.');
    toast({
      title: "Database Configuration Required",
      description: "Please configure valid Supabase credentials to use this application.",
      variant: "destructive",
    });
    return;
  }

  try {
    // First, delete all records
    const { error: deleteError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .neq('registrationId', ''); // Delete all records
    
    if (deleteError) {
      console.error('Error deleting registrations:', deleteError);
      toast({
        title: "Update Error",
        description: "Failed to update the database. Could not clear existing records.",
        variant: "destructive",
      });
      return;
    }
    
    // Then insert all the registrations
    const { error: insertError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(db.registrations);
    
    if (insertError) {
      console.error('Error inserting registrations:', insertError);
      toast({
        title: "Update Error",
        description: "Failed to save your changes to the database.",
        variant: "destructive",
      });
    }
    
    // Create downloadable blob for export feature
    const jsonData = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Store the latest blob in sessionStorage for easy access
    sessionStorage.setItem('latestRegistrationsBlob', URL.createObjectURL(blob));
  } catch (error) {
    console.error('Error saving database to Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the database. Please check your configuration.",
      variant: "destructive",
    });
  }
};

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
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(registration);
    
    if (error) {
      console.error('Error adding registration to Supabase:', error);
      toast({
        title: "Registration Failed",
        description: "Could not save your registration to the database. Please check your configuration.",
        variant: "destructive",
      });
      return false;
    } else {
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
