
import React, { useState } from 'react';
import { useStudentSchedules } from '@/hooks/useStudentSchedules';
import { StudentAssignmentForm } from './StudentAssignmentForm';
import { ScheduleFilters } from './ScheduleFilters';
import { ScheduleAssignmentsList } from './ScheduleAssignmentsList';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState<string>('');

  const {
    unassignedStudents,
    isLoading,
    assignStudent,
    removeAssignment,
  } = useStudentSchedules(studentSchedules, onUpdate);

  const getTimeSlotCapacity = (timeSlotId: string) => {
    const slot = timeSlots.find(s => s.id === timeSlotId);
    const assigned = studentSchedules.filter(s => s.time_slot_id === timeSlotId).length;
    return {
      assigned,
      total: slot?.max_capacity || 0,
      available: (slot?.max_capacity || 0) - assigned
    };
  };

  const filteredSchedules = studentSchedules.filter(schedule => {
    // Apply search filter
    let matchesSearch = true;
    if (searchTerm) {
      const student = schedule.registrations;
      matchesSearch = (
        student?.childname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.parentname.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply day filter
    let matchesDay = true;
    if (dayFilter) {
      matchesDay = schedule.day_of_week === dayFilter;
    }

    return matchesSearch && matchesDay;
  });

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
      <StudentAssignmentForm
        timeSlots={timeSlots}
        unassignedStudents={unassignedStudents}
        onAssign={assignStudent}
        getTimeSlotCapacity={getTimeSlotCapacity}
      />

      <ScheduleFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        dayFilter={dayFilter}
        onDayFilterChange={setDayFilter}
      />

      <ScheduleAssignmentsList
        timeSlots={timeSlots}
        filteredSchedules={filteredSchedules}
        onRemoveAssignment={removeAssignment}
        getTimeSlotCapacity={getTimeSlotCapacity}
      />
    </div>
  );
};
