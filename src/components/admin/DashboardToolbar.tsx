
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Upload, Save } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useToast } from '@/hooks/use-toast';
import { 
  handleSaveDatabase,
  handleExportDatabase,
  handleImportDatabase
} from '@/utils/admin/fileOperations';

interface DashboardToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  onImport: () => Promise<void>;
  onLogout: () => void;
}

export const DashboardToolbar: React.FC<DashboardToolbarProps> = ({
  searchTerm,
  setSearchTerm,
  searchFilter,
  setSearchFilter,
  onImport,
  onLogout
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    try {
      await handleImportDatabase(file || null, toast, onImport);
    } finally {
      // Reset the input
      event.target.value = '';
    }
  };

  return (
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
          onChange={handleFileInputChange}
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" onClick={() => handleSaveDatabase(toast)}>
          <Save className="h-4 w-4 mr-2" />
          Save to File
        </Button>
        <Button variant="outline" onClick={() => handleExportDatabase(toast)}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </div>
    </div>
  );
};
