
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface StudentScheduleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dayFilter: string;
  onDayFilterChange: (value: string) => void;
}

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export const StudentScheduleFilters: React.FC<StudentScheduleFiltersProps> = ({
  searchTerm,
  onSearchChange,
  dayFilter,
  onDayFilterChange,
}) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="w-48">
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Select value={dayFilter} onValueChange={onDayFilterChange}>
            <SelectTrigger className="pl-10">
              <SelectValue placeholder="Filter by day..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Days</SelectItem>
              {daysOfWeek.map(day => (
                <SelectItem key={day.value} value={day.value}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
