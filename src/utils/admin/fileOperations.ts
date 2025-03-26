
import { useToast } from '@/hooks/use-toast';
import { 
  exportDatabase, 
  importDatabase, 
  getDownloadLink 
} from '@/utils/database';

// Handle saving database to local file
export const handleSaveDatabase = async (toast: ReturnType<typeof useToast>['toast']) => {
  try {
    const downloadLink = getDownloadLink();
    if (downloadLink) {
      // Create anchor and trigger download
      const a = document.createElement('a');
      a.href = downloadLink;
      a.download = `robotics-registrations-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      
      toast({
        title: "Save Successful",
        description: "Registration data file has been saved.",
      });
    } else {
      // If no download link is available (e.g., first time), generate one
      await handleExportDatabase(toast);
      setTimeout(() => handleSaveDatabase(toast), 100); // Try again after a small delay
    }
  } catch (error) {
    console.error("Error saving database to file:", error);
    toast({
      title: "Save Failed",
      description: "Failed to save registration data file.",
    });
  }
};

// Handle database export
export const handleExportDatabase = async (toast: ReturnType<typeof useToast>['toast']) => {
  try {
    const jsonData = await exportDatabase();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `robotics-registrations-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Export Successful",
      description: "Registration data has been exported successfully.",
    });
  } catch (error) {
    console.error("Error exporting database:", error);
    toast({
      title: "Export Failed",
      description: "Failed to export registration data.",
    });
  }
};

// Handle database import
export const handleImportDatabase = async (
  file: File | null, 
  toast: ReturnType<typeof useToast>['toast'],
  loadRegistrations: () => Promise<void>
) => {
  if (!file) return;
  
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const jsonData = e.target?.result as string;
        const success = await importDatabase(jsonData);
        
        if (success) {
          await loadRegistrations(); // Reload registrations
          toast({
            title: "Import Successful",
            description: "Registration data has been imported successfully.",
          });
          resolve();
        } else {
          toast({
            title: "Import Failed",
            description: "Invalid data format. Please check your JSON file.",
          });
          reject(new Error("Invalid data format"));
        }
      } catch (error) {
        console.error("Error importing database:", error);
        toast({
          title: "Import Failed",
          description: "Failed to import registration data.",
        });
        reject(error);
      }
    };
    
    reader.readAsText(file);
  });
};
