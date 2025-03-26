
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SearchBar } from './SearchBar';
import { RegistrationsTable, EnhancedRegistration } from './RegistrationsTable';
import { PaginationControls } from './PaginationControls';
import { getAllRegistrations, deleteRegistration, exportDatabase, importDatabase, Registration, getDownloadLink } from '@/utils/database';
import { Download, Upload, Save } from 'lucide-react';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [registrations, setRegistrations] = useState<EnhancedRegistration[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const itemsPerPage = 5;

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      // Load registrations from our database utility - now properly awaiting the Promise
      const loadedRegistrations = await getAllRegistrations();
      console.log("Loaded registrations:", loadedRegistrations);
      // Convert Registration[] to EnhancedRegistration[] - they should be compatible now
      setRegistrations(loadedRegistrations as EnhancedRegistration[]);
      
      // If no registrations in new DB but exist in old storage, migrate them
      if (loadedRegistrations.length === 0) {
        const oldRegistrations = localStorage.getItem('registrations');
        if (oldRegistrations) {
          try {
            const parsedOldRegistrations = JSON.parse(oldRegistrations);
            if (Array.isArray(parsedOldRegistrations) && parsedOldRegistrations.length > 0) {
              console.log("Migrating old registrations to new database format");
              await importDatabase(JSON.stringify({ registrations: parsedOldRegistrations }));
              // Need the as EnhancedRegistration[] type assertion to satisfy TypeScript
              setRegistrations(parsedOldRegistrations as EnhancedRegistration[]);
            }
          } catch (error) {
            console.error("Error parsing old registrations:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error loading registrations:", error);
      toast({
        title: "Error",
        description: "Failed to load registrations data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRegistration = async (registrationId: string) => {
    try {
      // Delete the registration using our database utility
      await deleteRegistration(registrationId);
      
      // Update state with the filtered registrations
      setRegistrations(prevRegistrations => 
        prevRegistrations.filter(reg => reg.registrationId !== registrationId)
      );
      
      // Show toast notification
      toast({
        title: "Registration Deleted",
        description: `Registration ${registrationId} has been successfully deleted.`,
      });
      
      // If current page is now empty (except for the last page), go to previous page
      const filteredRegs = getFilteredRegistrations(
        registrations.filter(reg => reg.registrationId !== registrationId)
      );
      const totalPages = Math.ceil(filteredRegs.length / itemsPerPage);
      if (currentPage > totalPages && currentPage > 1) {
        setCurrentPage(prevPage => prevPage - 1);
      }
    } catch (error) {
      console.error("Error deleting registration:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the registration. Please try again.",
      });
    }
  };

  // Handle saving database to local file
  const handleSaveDatabase = async () => {
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
        await handleExportDatabase();
        setTimeout(handleSaveDatabase, 100); // Try again after a small delay
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
  const handleExportDatabase = async () => {
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
  const handleImportDatabase = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
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
        } else {
          toast({
            title: "Import Failed",
            description: "Invalid data format. Please check your JSON file.",
          });
        }
      } catch (error) {
        console.error("Error importing database:", error);
        toast({
          title: "Import Failed",
          description: "Failed to import registration data.",
        });
      }
    };
    
    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  // Filter registrations based on search term and selected filter
  const getFilteredRegistrations = (regs = registrations) => {
    const searchTermLower = searchTerm.toLowerCase();
    
    return regs.filter(reg => {
      switch(searchFilter) {
        case 'childName':
          return reg.childName.toLowerCase().includes(searchTermLower);
        case 'parentName':
          return reg.parentName.toLowerCase().includes(searchTermLower);
        case 'email':
          return reg.parentEmail.toLowerCase().includes(searchTermLower);
        case 'regId':
          return reg.registrationId?.toLowerCase().includes(searchTermLower);
        case 'all':
        default:
          return (
            reg.parentName.toLowerCase().includes(searchTermLower) ||
            reg.childName.toLowerCase().includes(searchTermLower) ||
            reg.parentEmail.toLowerCase().includes(searchTermLower) ||
            reg.registrationId?.toLowerCase().includes(searchTermLower)
          );
      }
    });
  };

  // Get filtered registrations
  const filteredRegistrations = getFilteredRegistrations();

  // Pagination logic
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);
  const currentRegistrations = filteredRegistrations.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Hidden file input for import
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImportDatabase}
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" onClick={handleSaveDatabase}>
            <Save className="h-4 w-4 mr-2" />
            Save to File
          </Button>
          <Button variant="outline" onClick={handleExportDatabase}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Registrations ({filteredRegistrations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading registrations...</span>
            </div>
          ) : (
            <>
              <RegistrationsTable 
                registrations={currentRegistrations} 
                onDeleteRegistration={handleDeleteRegistration} 
              />
              <PaginationControls 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};
