
import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { DBStorage, emptyDB } from './types';
import { toast } from '@/hooks/use-toast';

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
    console.log('Attempting to load registrations from Supabase...');
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
    
    console.log(`Successfully loaded ${data?.length || 0} registrations from Supabase`);
    return {
      registrations: data || []
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
