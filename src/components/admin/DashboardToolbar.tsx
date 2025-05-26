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
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex items-center space-x-2 flex-grow">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search registrations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="searchFilter" className="text-sm font-medium">
            Filter by:
          </Label>
          <select
            id="searchFilter"
            className="border rounded px-2 py-1 text-sm"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          >
            <option value="">All Fields</option>
            <option value="parentname">Parent Name</option>
            <option value="parentemail">Parent Email</option>
            <option value="childname">Child Name</option>
            {/* Add more filter options as needed */}
          </select>
        </div>
      </div>
      
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
