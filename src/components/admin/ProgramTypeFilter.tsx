
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProgramTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const ProgramTypeFilter: React.FC<ProgramTypeFilterProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="program-type-filter" className="text-sm font-medium">
        Program Type
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Filter by program type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Programs</SelectItem>
          <SelectItem value="regular">Regular Yearly Classes</SelectItem>
          <SelectItem value="summer-camp">Summer Fun Classes</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
