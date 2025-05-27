
import React from 'react';
import { useStudentScheduleData } from '@/hooks/useStudentScheduleData';
import { StudentScheduleFilters } from './StudentScheduleFilters';
import { StudentScheduleForm } from './StudentScheduleForm';
import { StudentScheduleList } from './StudentScheduleList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Users } from 'lucide-react';
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
  console.log('StudentScheduleAssignment: Rendering with props:', {
    timeSlotsCount: timeSlots?.length || 0,
    studentSchedulesCount: studentSchedules?.length || 0
  });

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
  } = useStudentScheduleData(studentSchedules || [], onUpdate);

  console.log('StudentScheduleAssignment: Hook data:', {
    searchTerm,
    dayFilter,
    filteredSchedulesCount: filteredSchedules?.length || 0,
    unassignedStudentsCount: unassignedStudents?.length || 0,
    isLoading,
    error
  });

  if (error) {
    console.error('StudentScheduleAssignment: Error state:', error);
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    console.log('StudentScheduleAssignment: Rendering loading state');
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-2">Loading assignments...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we have the required data
  if (!timeSlots || timeSlots.length === 0) {
    console.log('StudentScheduleAssignment: No time slots available');
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <Users className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No Time Slots Available</h3>
              <p className="text-gray-500">Please create time slots first before assigning students.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  console.log('StudentScheduleAssignment: Rendering main content');

  return (
    <div className="space-y-6">
      <StudentScheduleForm
        timeSlots={timeSlots}
        unassignedStudents={unassignedStudents || []}
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
        filteredSchedules={filteredSchedules || []}
        onRemoveAssignment={removeAssignment}
        getTimeSlotCapacity={getTimeSlotCapacity}
      />
    </div>
  );
};
