
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { Registration, DBStorage, emptyDB } from './types';
import { toast } from '@/hooks/use-toast';

// Load all registrations from Supabase with proper fallback
export const loadDatabase = async (): Promise<DBStorage> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.warn('Using local storage fallback due to missing Supabase credentials');
    // Fallback to local storage
    try {
      const localData = localStorage.getItem('roboticsDB');
      return localData ? JSON.parse(localData) : emptyDB;
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return emptyDB;
    }
  }

  try {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error loading registrations from Supabase:', error);
      toast({
        title: "Database Error",
        description: "Could not load registrations from the cloud database. Falling back to local storage.",
        variant: "destructive",
      });
      
      // Fallback to local storage
      try {
        const localData = localStorage.getItem('roboticsDB');
        return localData ? JSON.parse(localData) : emptyDB;
      } catch (storageError) {
        console.error('Error loading from local storage:', storageError);
        return emptyDB;
      }
    }
    
    return {
      registrations: data as Registration[]
    };
  } catch (error) {
    console.error('Error accessing Supabase database:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the cloud database. Using local data instead.",
      variant: "destructive",
    });
    
    // Fallback to local storage
    try {
      const localData = localStorage.getItem('roboticsDB');
      return localData ? JSON.parse(localData) : emptyDB;
    } catch (storageError) {
      console.error('Error loading from local storage:', storageError);
      return emptyDB;
    }
  }
};

// Save the entire database with proper error handling
export const saveDatabase = async (db: DBStorage): Promise<void> => {
  // Always save to local storage as a backup
  try {
    localStorage.setItem('roboticsDB', JSON.stringify(db));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }

  // If no valid Supabase credentials, don't attempt to save to Supabase
  if (!hasValidCredentials()) {
    console.warn('Skipping Supabase save due to missing credentials');
    return;
  }

  try {
    // This is a crude approach - in a real app, you would handle updates more carefully
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
        description: "Failed to save your changes to the cloud database.",
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
      description: "Could not connect to the cloud database. Your changes were saved locally.",
      variant: "destructive",
    });
  }
};

// Get all registrations with proper fallback
export const getAllRegistrations = async (): Promise<Registration[]> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.warn('Using local storage fallback for getAllRegistrations due to missing Supabase credentials');
    // Fallback to local storage
    try {
      const localData = localStorage.getItem('roboticsDB');
      const parsedData = localData ? JSON.parse(localData) : emptyDB;
      return parsedData.registrations;
    } catch (error) {
      console.error('Error loading from local storage:', error);
      return [];
    }
  }

  try {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error getting registrations:', error);
      toast({
        title: "Data Fetch Error",
        description: "Could not retrieve registrations from the cloud database. Using local data.",
        variant: "destructive",
      });
      
      // Fallback to local storage
      try {
        const localData = localStorage.getItem('roboticsDB');
        const parsedData = localData ? JSON.parse(localData) : emptyDB;
        return parsedData.registrations;
      } catch (storageError) {
        console.error('Error loading from local storage:', storageError);
        return [];
      }
    }
    
    return data as Registration[];
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the cloud database. Using local data instead.",
      variant: "destructive",
    });
    
    // Fallback to local storage
    try {
      const localData = localStorage.getItem('roboticsDB');
      const parsedData = localData ? JSON.parse(localData) : emptyDB;
      return parsedData.registrations;
    } catch (storageError) {
      console.error('Error loading from local storage:', storageError);
      return [];
    }
  }
};

// Add a new registration with proper fallback
export const addRegistration = async (registration: Registration): Promise<void> => {
  // Always save to local storage first as a backup
  try {
    const localStorageDb = JSON.parse(localStorage.getItem('roboticsDB') || JSON.stringify(emptyDB));
    localStorageDb.registrations.push(registration);
    localStorage.setItem('roboticsDB', JSON.stringify(localStorageDb));
  } catch (error) {
    console.error('Error saving to local storage:', error);
  }

  // If no valid Supabase credentials, don't attempt to save to Supabase
  if (!hasValidCredentials()) {
    console.warn('Skipping Supabase save due to missing credentials');
    toast({
      title: "Registration Saved",
      description: "Your registration has been saved locally. Cloud storage is not configured.",
    });
    return;
  }

  try {
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(registration);
    
    if (error) {
      console.error('Error adding registration to Supabase:', error);
      toast({
        title: "Cloud Storage Unavailable",
        description: "Could not save to cloud database. Registration saved locally instead.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Saved",
        description: "Your registration has been successfully saved to the cloud database.",
      });
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not access cloud database. Registration saved locally instead.",
      variant: "destructive",
    });
  }
};

// Delete a registration with proper fallback
export const deleteRegistration = async (registrationId: string): Promise<void> => {
  // Also remove from local storage
  try {
    const localStorageDb = JSON.parse(localStorage.getItem('roboticsDB') || JSON.stringify(emptyDB));
    localStorageDb.registrations = localStorageDb.registrations.filter(
      (reg: Registration) => reg.registrationId !== registrationId
    );
    localStorage.setItem('roboticsDB', JSON.stringify(localStorageDb));
  } catch (error) {
    console.error('Error updating local storage:', error);
  }

  // If no valid Supabase credentials, don't attempt to delete from Supabase
  if (!hasValidCredentials()) {
    console.warn('Skipping Supabase delete due to missing credentials');
    toast({
      title: "Registration Deleted",
      description: "Registration was deleted from local storage. Cloud storage is not configured.",
    });
    return;
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
        description: "Could not delete the registration from the cloud database, but it was removed locally.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Registration Deleted",
        description: "Registration was successfully deleted from the database.",
      });
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    toast({
      title: "Connection Error",
      description: "Could not connect to the cloud database to delete the registration, but it was removed locally.",
      variant: "destructive",
    });
  }
};
