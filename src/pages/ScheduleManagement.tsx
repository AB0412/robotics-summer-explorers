
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabase/client';
import { TimeSlotManager } from '@/components/schedule/TimeSlotManager';
import { StudentScheduleAssignment } from '@/components/schedule/StudentScheduleAssignment';
import { ScheduleCalendarView } from '@/components/schedule/ScheduleCalendarView';

export interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  days: string[];
  max_capacity: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface StudentSchedule {
  id: string;
  registration_id: string;
  time_slot_id: string;
  assigned_at: string;
  notes: string;
  registrations?: {
    childname: string;
    parentname: string;
    childage: string;
    childgrade: string;
  };
  program_time_slots?: TimeSlot;
}

const ScheduleManagement = () => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [studentSchedules, setStudentSchedules] = useState<StudentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'slots' | 'assignments' | 'calendar'>('slots');

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

      if (slotsError) {
        console.error('Error loading time slots:', slotsError);
        toast({
          title: "Error",
          description: "Failed to load time slots",
          variant: "destructive",
        });
      } else {
        setTimeSlots(slots || []);
      }

      // Load student schedules with registration details
      const { data: schedules, error: schedulesError } = await supabase
        .from('student_schedules')
        .select(`
          *,
          registrations(childname, parentname, childage, childgrade),
          program_time_slots(*)
        `)
        .order('assigned_at', { ascending: false });

      if (schedulesError) {
        console.error('Error loading student schedules:', schedulesError);
        toast({
          title: "Error",
          description: "Failed to load student schedules",
          variant: "destructive",
        });
      } else {
        setStudentSchedules(schedules || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load schedule data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Schedule Management</h1>
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
            variant={activeTab === 'slots' ? 'default' : 'outline'}
            onClick={() => setActiveTab('slots')}
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Time Slots
          </Button>
          <Button
            variant={activeTab === 'assignments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('assignments')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Assignments
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

      {activeTab === 'slots' && (
        <TimeSlotManager 
          timeSlots={timeSlots} 
          onUpdate={loadData}
        />
      )}

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
