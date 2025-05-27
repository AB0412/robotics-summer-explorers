
import React from 'react';
import { useStudentScheduleData } from '@/hooks/useStudentScheduleData';
import { StudentScheduleFilters } from './StudentScheduleFilters';
import { StudentScheduleForm } from './StudentScheduleForm';
import { StudentScheduleList } from './StudentScheduleList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { TimeSlot, StudentSchedule } from '@/types/schedule';

interface StudentScheduleAssignmentProps {
  timeSlots: TimeSlot[];
  studentSchedules: StudentSchedule[];
  onUpdate: () => void;
}

export const StudentScheduleAssignment: React.FC<StudentScheduleAssignmentProps> = ({
  timeSlots,
  studentSchedules,
  onUpdate,
}) => {
  const {
    searchTerm,
    setSearchTerm,
    dayFilter,
    setDayFilter,
    filteredSchedules,
    unassignedStudents,
    isLoading,
    error,
    assignStudent,
    removeAssignment,
    getTimeSlotCapacity,
  } = useStudentScheduleData(studentSchedules, onUpdate);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading assignments...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentScheduleForm
        timeSlots={timeSlots}
        unassignedStudents={unassignedStudents}
        onAssign={assignStudent}
        getTimeSlotCapacity={getTimeSlotCapacity}
      />

      <StudentScheduleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dayFilter={dayFilter}
        onDayFilterChange={setDayFilter}
      />

      <StudentScheduleList
        timeSlots={timeSlots}
        filteredSchedules={filteredSchedules}
        onRemoveAssignment={removeAssignment}
        getTimeSlotCapacity={getTimeSlotCapacity}
      />
    </div>
  );
};
