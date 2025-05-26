
import { DBStorage } from './types';
import { toast } from '@/hooks/use-toast';
import { loadDatabase, saveDatabase } from './core';

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
      const value = reg[header] || '';
      // Escape quotes in values and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
};

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
