
// This file provides database functionality using Supabase
// It replaces the previous localStorage/IndexedDB implementation

import { createClient } from '@supabase/supabase-js';

// Interface for our database storage
export interface DBStorage {
  registrations: Registration[];
}

// Registration interface matching our form data
export interface Registration {
  registrationId: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  emergencyContact: string;
  childName: string;
  childAge: string;
  childGrade: string;
  schoolName: string;
  medicalInfo?: string;
  preferredBatch: string;
  alternateBatch?: string;
  hasPriorExperience: "yes" | "no"; // Updated to match enum in form schema
  experienceDescription?: string;
  interestLevel?: string;
  referralSource: string;
  photoConsent: boolean;
  waiverAgreement: boolean;
  tShirtSize?: string;
  specialRequests?: string;
  volunteerInterest: boolean;
  submittedAt: string;
}

// Initialize empty database structure
const emptyDB: DBStorage = {
  registrations: []
};

// Supabase client setup
// Replace these with your actual Supabase URL and anon key from your Supabase project settings
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Table name in Supabase
const REGISTRATIONS_TABLE = 'registrations';

// Initialize the database (create tables if they don't exist)
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Check if the table exists by trying to select from it
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*')
      .limit(1);

    if (error) {
      console.error('Table might not exist, please create it in Supabase dashboard:', error);
      // We can't create tables from the client side with Supabase
      alert(`Please create a table named '${REGISTRATIONS_TABLE}' in your Supabase dashboard with the appropriate columns.`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

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

// Search registrations by field and term
export const searchRegistrations = async (
  field: 'all' | 'parentName' | 'childName' | 'parentEmail' | 'registrationId',
  term: string
): Promise<Registration[]> => {
  try {
    if (!term.trim()) {
      return getAllRegistrations();
    }
    
    if (field === 'all') {
      // For 'all' we need to make multiple queries and combine results
      const [nameResults, emailResults, idResults, childNameResults] = await Promise.all([
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentName', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('parentEmail', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('registrationId', `%${term}%`),
        supabase.from(REGISTRATIONS_TABLE).select('*').ilike('childName', `%${term}%`)
      ]);
      
      // Combine results, removing duplicates
      const combinedResults = [
        ...(nameResults.data || []),
        ...(emailResults.data || []),
        ...(idResults.data || []),
        ...(childNameResults.data || [])
      ];
      
      // Remove duplicates by registrationId
      const uniqueResults = Array.from(
        new Map(combinedResults.map(item => [item.registrationId, item])).values()
      );
      
      return uniqueResults as Registration[];
    } else {
      // For specific fields, we can do a single query
      const { data, error } = await supabase
        .from(REGISTRATIONS_TABLE)
        .select('*')
        .ilike(field, `%${term}%`);
      
      if (error) {
        console.error(`Error searching registrations by ${field}:`, error);
        return [];
      }
      
      return data as Registration[];
    }
  } catch (error) {
    console.error('Error searching registrations:', error);
    return [];
  }
};

// Export database as JSON
export const exportDatabase = async (): Promise<string> => {
  const db = await loadDatabase();
  return JSON.stringify(db, null, 2);
};

// Import database from JSON string
export const importDatabase = async (jsonData: string): Promise<boolean> => {
  try {
    const parsedData = JSON.parse(jsonData);
    
    // Validate the data has the expected structure
    if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.registrations)) {
      await saveDatabase(parsedData);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error importing database:', error);
    return false;
  }
};

// Get a download link for the latest database
export const getDownloadLink = (): string => {
  return sessionStorage.getItem('latestRegistrationsBlob') || '';
};

// Initialize the database when this module loads
initializeDatabase().catch(error => {
  console.error('Failed to initialize database:', error);
});
