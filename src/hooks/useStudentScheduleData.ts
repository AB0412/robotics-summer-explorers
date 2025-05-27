
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Registration, StudentSchedule } from '@/types/schedule';

export const useStudentScheduleData = (studentSchedules: StudentSchedule[], onUpdate: () => void) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('useStudentScheduleData: Effect triggered, loading registrations...');
    loadRegistrations();
  }, [studentSchedules]);

  const loadRegistrations = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('useStudentScheduleData: Starting registration load...');
      
      const { data, error: regError } = await supabase
        .from('registrations')
        .select('registrationid, childname, parentname, childage, childgrade, preferredbatch')
        .order('childname');

      if (regError) {
        console.error('useStudentScheduleData: Error loading registrations:', regError);
        throw new Error(`Failed to load registrations: ${regError.message}`);
      }

      console.log('useStudentScheduleData: Registrations loaded:', data?.length || 0);
      const registrationsData = data || [];
      setRegistrations(registrationsData);
      
      // Find unassigned students
      const assignedStudentIds = (studentSchedules || []).map(s => s.registration_id);
      const unassigned = registrationsData.filter(reg => !assignedStudentIds.includes(reg.registrationid));
      setUnassignedStudents(unassigned);
      
      console.log('useStudentScheduleData: Unassigned students:', unassigned.length);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error loading registrations';
      console.error('useStudentScheduleData: Error in loadRegistrations:', err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('useStudentScheduleData: Registration loading finished');
    }
  };

  const assignStudent = async (selectedStudent: string, selectedTimeSlot: string, selectedDay: string, notes: string) => {
    if (!selectedStudent || !selectedTimeSlot || !selectedDay) {
      toast({
        title: "Validation Error",
        description: "Please select a student, time slot, and day of the week",
        variant: "destructive",
      });
      return false;
    }

    // Check if student is already assigned to this time slot on this day
    const existingAssignment = (studentSchedules || []).find(
      s => s.registration_id === selectedStudent && 
           s.time_slot_id === selectedTimeSlot && 
           s.day_of_week === selectedDay
    );

    if (existingAssignment) {
      toast({
        title: "Already Assigned",
        description: "This student is already assigned to this time slot on this day",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('useStudentScheduleData: Assigning student:', {
        registration_id: selectedStudent,
        time_slot_id: selectedTimeSlot,
        day_of_week: selectedDay,
        notes: notes || null,
      });

      const { error } = await supabase
        .from('student_schedules')
        .insert([{
          registration_id: selectedStudent,
          time_slot_id: selectedTimeSlot,
          day_of_week: selectedDay,
          notes: notes || null,
        }]);

      if (error) {
        console.error('useStudentScheduleData: Database error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Student assigned to time slot successfully",
      });

      onUpdate();
      return true;
    } catch (error) {
      console.error('useStudentScheduleData: Error assigning student:', error);
      toast({
        title: "Error",
        description: `Failed to assign student to time slot: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const removeAssignment = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to remove this student assignment?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('student_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student assignment removed successfully",
      });
      onUpdate();
    } catch (error) {
      console.error('useStudentScheduleData: Error removing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove student assignment",
        variant: "destructive",
      });
    }
  };

  const getTimeSlotCapacity = (timeSlotId: string) => {
    const assignedCount = (studentSchedules || []).filter(s => s.time_slot_id === timeSlotId).length;
    return {
      assigned: assignedCount,
      total: 20, // Default capacity
      available: 20 - assignedCount
    };
  };

  // Apply filters
  const filteredSchedules = (studentSchedules || []).filter(schedule => {
    // Apply search filter
    let matchesSearch = true;
    if (searchTerm) {
      const student = schedule.registrations;
      matchesSearch = (
        student?.childname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student?.parentname?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply day filter
    let matchesDay = true;
    if (dayFilter) {
      matchesDay = schedule.day_of_week === dayFilter;
    }

    return matchesSearch && matchesDay;
  });

  return {
    searchTerm,
    setSearchTerm,
    dayFilter,
    setDayFilter,
    filteredSchedules,
    registrations,
    unassignedStudents,
    isLoading,
    error,
    assignStudent,
    removeAssignment,
    getTimeSlotCapacity,
  };
};
