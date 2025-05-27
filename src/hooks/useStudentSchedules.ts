
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabase/client';
import type { Registration } from '@/types/schedule';

export const useStudentSchedules = (studentSchedules: any[], onUpdate: () => void) => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, [studentSchedules]);

  const loadRegistrations = async () => {
    try {
      console.log('Loading registrations...');
      const { data, error } = await supabase
        .from('registrations')
        .select('registrationid, childname, parentname, childage, childgrade, preferredbatch')
        .order('childname');

      if (error) {
        console.error('Error loading registrations:', error);
        throw error;
      }

      console.log('Loaded registrations:', data);
      setRegistrations(data || []);
      
      // Find unassigned students
      const assignedStudentIds = studentSchedules.map(s => s.registration_id);
      const unassigned = (data || []).filter(reg => !assignedStudentIds.includes(reg.registrationid));
      setUnassignedStudents(unassigned);
      console.log('Unassigned students:', unassigned);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast({
        title: "Error",
        description: "Failed to load student registrations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
    const existingAssignment = studentSchedules.find(
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
      console.log('Assigning student:', {
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
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Student assigned to time slot successfully",
      });

      onUpdate();
      return true;
    } catch (error) {
      console.error('Error assigning student:', error);
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
      console.error('Error removing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove student assignment",
        variant: "destructive",
      });
    }
  };

  return {
    registrations,
    unassignedStudents,
    isLoading,
    assignStudent,
    removeAssignment,
  };
};
