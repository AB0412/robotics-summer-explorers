
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgramTypeFilter } from './ProgramTypeFilter';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchFilter: string;
  setSearchFilter: (filter: string) => void;
  programTypeFilter: string;
  setProgramTypeFilter: (filter: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  searchFilter,
  setSearchFilter,
  programTypeFilter,
  setProgramTypeFilter
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search registrations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="search-filter" className="text-sm font-medium">
            Search In
          </label>
          <Select value={searchFilter} onValueChange={setSearchFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select search field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Fields</SelectItem>
              <SelectItem value="childName">Child Name</SelectItem>
              <SelectItem value="parentName">Parent Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="regId">Registration ID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ProgramTypeFilter 
          value={programTypeFilter}
          onChange={setProgramTypeFilter}
        />
      </div>
    </div>
  );
};
