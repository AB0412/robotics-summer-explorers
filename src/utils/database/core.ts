import { supabase, REGISTRATIONS_TABLE, hasValidCredentials } from '../supabase/client';
import { DBStorage, emptyDB, SupabaseRegistration } from './types';

// Helper function to convert registrations to CSV format
const convertToCSV = (registrations: any[]): string => {
  if (registrations.length === 0) return '';
  
  // Get all unique keys from all registrations
  const allKeys = new Set<string>();
  registrations.forEach(reg => {
    Object.keys(reg).forEach(key => allKeys.add(key));
  });
  
  const headers = Array.from(allKeys);
  
  // Create CSV header row
  const csvHeaders = headers.map(header => `"${header}"`).join(',');
  
  // Create CSV data rows
  const csvRows = registrations.map(reg => {
    return headers.map(header => {
      const value = reg[header] ?? '';
      // Escape quotes in values and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

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
        registrations: (data as unknown as any[]) || []
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
      .neq('registrationid', ''); // Delete all records
    
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
        .insert(db.registrations as unknown as any[]);
      
      if (insertError) {
        console.error('Error inserting registrations:', insertError);
        return {
          success: false,
          error: `Failed to save your changes to the database: ${insertError.message}`
        };
      }
    }
    
    // Create downloadable CSV blob for export feature
    const csvData = convertToCSV(db.registrations);
    const blob = new Blob([csvData], { type: 'text/csv' });
    
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

// Export database to JSON
export const exportDatabase = async (): Promise<string> => {
  const result = await loadDatabase();
  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to load database for export');
  }
  return JSON.stringify(result.data.registrations, null, 2);
};

// Import database from JSON
export const importDatabase = async (jsonData: string): Promise<void> => {
  try {
    const registrations = JSON.parse(jsonData);
    
    if (!Array.isArray(registrations)) {
      throw new Error('Invalid JSON format - expected an array of registrations');
    }

    await saveDatabase({ registrations });
    console.log(`Successfully imported ${registrations.length} registrations`);
  } catch (error) {
    console.error('Error importing database:', error);
    throw new Error('Failed to import database');
  }
};

// Get download link for exported data (CSV)
export const getDownloadLink = async (): Promise<string> => {
  const jsonData = await exportDatabase();
  const parsed = JSON.parse(jsonData);
  const registrations = Array.isArray(parsed) ? parsed : (parsed?.registrations || []);
  const csvData = convertToCSV(registrations);
  const blob = new Blob([csvData], { type: 'text/csv' });
  return URL.createObjectURL(blob);
};
