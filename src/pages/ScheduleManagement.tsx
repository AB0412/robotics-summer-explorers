
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import { StudentScheduleAssignment } from '@/components/schedule/StudentScheduleAssignment';
import { ScheduleCalendarView } from '@/components/schedule/ScheduleCalendarView';
import { supabase } from '@/utils/supabase/client';
import type { TimeSlot, StudentSchedule } from '@/types/schedule';

const ScheduleManagement = () => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'calendar'>('assignments');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [studentSchedules, setStudentSchedules] = useState<StudentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load time slots
      const { data: slots, error: slotsError } = await supabase
        .from('program_time_slots')
        .select('*')
        .order('start_time');

      if (slotsError) throw slotsError;
      setTimeSlots(slots || []);

      // Load student schedules with related data
      const { data: schedules, error: schedulesError } = await supabase
        .from('student_schedules')
        .select(`
          *,
          registrations(childname, parentname, childage, childgrade),
          program_time_slots(*)
        `)
        .order('assigned_at', { ascending: false });

      if (schedulesError) throw schedulesError;
      setStudentSchedules(schedules || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading schedule data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'assignments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('assignments')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Student Assignments
          </Button>
          <Button
            variant={activeTab === 'calendar' ? 'default' : 'outline'}
            onClick={() => setActiveTab('calendar')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      {activeTab === 'assignments' && (
        <StudentScheduleAssignment 
          timeSlots={timeSlots}
          studentSchedules={studentSchedules}
          onUpdate={loadData}
        />
      )}
      {activeTab === 'calendar' && (
        <ScheduleCalendarView 
          timeSlots={timeSlots} 
          studentSchedules={studentSchedules} 
        />
      )}
    </div>
  );
};

export default ScheduleManagement;
