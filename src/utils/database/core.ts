
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { DBStorage, emptyDB } from './types';

// Check database readiness
export const isDatabaseReady = async (): Promise<boolean> => {
  if (!hasValidCredentials()) {
    return false;
  }

  try {
    const { error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('count')
      .limit(1);
      
    return !error;
  } catch (error) {
    console.error('Error checking database readiness:', error);
    return false;
  }
};

// Load all data from Supabase
export const loadDatabase = async (): Promise<{success: boolean; data?: DBStorage; error?: string}> => {
  // Check if we have valid Supabase credentials
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot load database.');
    return {
      success: false,
      error: 'Missing Supabase credentials. Cannot load database.',
      data: emptyDB
    };
  }

  try {
    console.log('Attempting to load registrations from Supabase...');
    const { data, error } = await supabase
      .from(REGISTRATIONS_TABLE)
      .select('*');
    
    if (error) {
      console.error('Error loading registrations from Supabase:', error);
      return {
        success: false,
        error: `Could not load registrations from the database: ${error.message}`,
        data: emptyDB
      };
    }
    
    console.log(`Successfully loaded ${data?.length || 0} registrations from Supabase`);
    return {
      success: true,
      data: {
        registrations: data || []
      }
    };
  } catch (error) {
    console.error('Error accessing Supabase database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error',
      data: emptyDB
    };
  }
};

// Save the entire database
export const saveDatabase = async (db: DBStorage): Promise<{success: boolean; error?: string}> => {
  // If no valid Supabase credentials, don't attempt to save
  if (!hasValidCredentials()) {
    console.error('Missing Supabase credentials. Cannot save database.');
    return {
      success: false,
      error: 'Missing Supabase credentials. Cannot save database.'
    };
  }

  try {
    // First, delete all records
    const { error: deleteError } = await supabase
      .from(REGISTRATIONS_TABLE)
      .delete()
      .neq('registrationId', ''); // Delete all records
    
    if (deleteError) {
      console.error('Error deleting registrations:', deleteError);
      return {
        success: false,
        error: `Failed to update the database. Could not clear existing records: ${deleteError.message}`
      };
    }
    
    // Then insert all the registrations
    if (db.registrations.length > 0) {
      const { error: insertError } = await supabase
        .from(REGISTRATIONS_TABLE)
        .insert(db.registrations);
      
      if (insertError) {
        console.error('Error inserting registrations:', insertError);
        return {
          success: false,
          error: `Failed to save your changes to the database: ${insertError.message}`
        };
      }
    }
    
    // Create downloadable blob for export feature
    const jsonData = JSON.stringify(db, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    
    // Store the latest blob in sessionStorage for easy access
    sessionStorage.setItem('latestRegistrationsBlob', URL.createObjectURL(blob));
    
    return {
      success: true
    };
  } catch (error) {
    console.error('Error saving database to Supabase:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown database error'
    };
  }
};
