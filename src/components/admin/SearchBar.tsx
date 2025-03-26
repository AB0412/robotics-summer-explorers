
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm, 
  searchFilter, 
  setSearchFilter 
}) => {
  return (
    <div className="flex space-x-2 items-center max-w-md w-full">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search registrations..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Select
        value={searchFilter}
        onValueChange={setSearchFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Search filter" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Fields</SelectItem>
          <SelectItem value="childName">Student Name</SelectItem>
          <SelectItem value="parentName">Parent Name</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="regId">Registration ID</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
