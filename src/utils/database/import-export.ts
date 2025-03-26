
import { DBStorage } from './types';

// Export database as JSON
export const exportDatabase = async (): Promise<string> => {
  // Import the function dynamically to avoid circular dependencies
  const { loadDatabase } = await import('./registrations');
  const db = await loadDatabase();
  return JSON.stringify(db, null, 2);
};

// Import database from JSON string
export const importDatabase = async (jsonData: string): Promise<boolean> => {
  try {
    const parsedData = JSON.parse(jsonData);
    
    // Validate the data has the expected structure
    if (parsedData && typeof parsedData === 'object' && Array.isArray(parsedData.registrations)) {
      // Import the function dynamically to avoid circular dependencies
      const { saveDatabase } = await import('./registrations');
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
