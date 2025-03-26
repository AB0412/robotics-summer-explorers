
import { DBStorage } from './types';
import { toast } from '@/hooks/use-toast';
import { loadDatabase, saveDatabase } from './core';

// Export database as JSON
export const exportDatabase = async (): Promise<string> => {
  try {
    const db = await loadDatabase();
    return JSON.stringify(db, null, 2);
  } catch (error) {
    console.error('Error exporting database:', error);
    toast({
      title: "Export Error",
      description: "Could not export the database.",
      variant: "destructive",
    });
    return "{}";
  }
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
    toast({
      title: "Import Error",
      description: "Invalid data format.",
      variant: "destructive",
    });
    return false;
  } catch (error) {
    console.error('Error importing database:', error);
    toast({
      title: "Import Error",
      description: "Could not import the database.",
      variant: "destructive",
    });
    return false;
  }
};

// Get a download link for the latest database
export const getDownloadLink = (): string => {
  return sessionStorage.getItem('latestRegistrationsBlob') || '';
};
