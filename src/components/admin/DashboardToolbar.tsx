
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Upload, 
  LogOut, 
  Search,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  handleExportDatabase, 
  handleImportDatabase, 
  handleSaveDatabase 
} from '@/utils/admin/fileOperations';
import { SearchBar } from './SearchBar';

interface DashboardToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  programTypeFilter: string;
  setProgramTypeFilter: (filter: string) => void;
  onImport: () => Promise<void>;
  onLogout: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  searchFilter,
  setSearchFilter,
  programTypeFilter,
  setProgramTypeFilter,
  onImport,
  onLogout,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      handleImportDatabase(file, toast, onImport)
        .catch(error => {
          console.error("Import failed:", error);
          toast({
            title: "Import Failed",
            description: "Failed to import registration data.",
            variant: "destructive",
          });
        });
    }
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col gap-4 mb-6">
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        programTypeFilter={programTypeFilter}
        setProgramTypeFilter={setProgramTypeFilter}
      />
      
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => window.location.href = '/schedule-management'}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Calendar className="h-4 w-4" />
          Schedule Management
        </Button>
        
        <Button
          onClick={() => handleExportDatabase(toast)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          onClick={triggerFileSelect}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Import
        </Button>
        <Button
          onClick={onLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      
      <input
        type="file"
        accept=".json, .csv"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        ref={fileInputRef}
      />
    </div>
  );
};
