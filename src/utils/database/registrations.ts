
import { supabase, REGISTRATIONS_TABLE } from '../supabase/client';
import { Registration, DBStorage, emptyDB } from './types';

// Load all registrations from Supabase
export const loadDatabase = async (): Promise<DBStorage> => {
  try {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error loading registrations from Supabase:', error);
      return emptyDB;
    }
    
    return {
      registrations: data as Registration[]
    };
  } catch (error) {
    console.error('Error accessing Supabase database:', error);
    return emptyDB;
  }
};

// Save the entire database (not typically used with Supabase, but kept for compatibility)
export const saveDatabase = async (db: DBStorage): Promise<void> => {
  try {
    // This is a crude approach - in a real app, you would handle updates more carefully
    // First, delete all records
    const { error: deleteError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .neq('registrationId', ''); // Delete all records
    
    if (deleteError) {
      console.error('Error deleting registrations:', deleteError);
      return;
    }
    
    // Then insert all the registrations
    const { error: insertError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(db.registrations);
    
    if (insertError) {
      console.error('Error inserting registrations:', insertError);
    }
    
    // Create downloadable blob for export feature
    const jsonData = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Store the latest blob in sessionStorage for easy access
    sessionStorage.setItem('latestRegistrationsBlob', URL.createObjectURL(blob));
    
  } catch (error) {
    console.error('Error saving database to Supabase:', error);
  }
};

// Get all registrations
export const getAllRegistrations = async (): Promise<Registration[]> => {
  try {
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error getting registrations:', error);
      return [];
    }
    
    return data as Registration[];
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    return [];
  }
};

// Add a new registration
export const addRegistration = async (registration: Registration): Promise<void> => {
  try {
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .insert(registration);
    
    if (error) {
      console.error('Error adding registration to Supabase:', error);
      
      // Fallback to local storage if Supabase fails
      const localStorageDb = JSON.parse(localStorage.getItem('roboticsDB') || JSON.stringify(emptyDB));
      localStorageDb.registrations.push(registration);
      localStorage.setItem('roboticsDB', JSON.stringify(localStorageDb));
      
      alert('Could not save to cloud database. Data saved locally instead.');
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    
    // Fallback to local storage
    const localStorageDb = JSON.parse(localStorage.getItem('roboticsDB') || JSON.stringify(emptyDB));
    localStorageDb.registrations.push(registration);
    localStorage.setItem('roboticsDB', JSON.stringify(localStorageDb));
    
    alert('Could not access cloud database. Data saved locally instead.');
  }
};

// Delete a registration
export const deleteRegistration = async (registrationId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .eq('registrationId', registrationId);
    
    if (error) {
      console.error('Error deleting registration from Supabase:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error accessing Supabase:', error);
    throw error;
  }
};
