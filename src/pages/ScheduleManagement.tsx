
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users, AlertCircle, RefreshCw } from 'lucide-react';
import { StudentScheduleAssignment } from '@/components/schedule/StudentScheduleAssignment';
import { ScheduleCalendarView } from '@/components/schedule/ScheduleCalendarView';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/utils/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { TimeSlot, StudentSchedule } from '@/types/schedule';

const ScheduleManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'assignments' | 'calendar'>('assignments');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [studentSchedules, setStudentSchedules] = useState<StudentSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ScheduleManagement: Component mounted, loading data...');
    loadData();
  }, []);

  const loadData = async () => {
    console.log('ScheduleManagement: Starting data load...');
    setIsLoading(true);
    setError(null);
    
    try {
      // Load time slots first
      console.log('ScheduleManagement: Loading time slots...');
      const { data: slots, error: slotsError } = await supabase
        .from('program_time_slots')
        .select('*')
        .order('start_time');

      if (slotsError) {
        console.error('ScheduleManagement: Error loading time slots:', slotsError);
        throw new Error(`Failed to load time slots: ${slotsError.message}`);
      }

      console.log('ScheduleManagement: Time slots loaded:', slots);
      setTimeSlots(slots || []);

      // Load student schedules with related data
      console.log('ScheduleManagement: Loading student schedules...');
      const { data: schedules, error: schedulesError } = await supabase
        .from('student_schedules')
        .select(`
          *,
          registrations(childname, parentname, childage, childgrade),
          program_time_slots(*)
        `)
        .order('assigned_at', { ascending: false });

      if (schedulesError) {
        console.error('ScheduleManagement: Error loading student schedules:', schedulesError);
        throw new Error(`Failed to load student schedules: ${schedulesError.message}`);
      }

      console.log('ScheduleManagement: Student schedules loaded:', schedules);
      setStudentSchedules(schedules || []);

      console.log('ScheduleManagement: Data loading completed successfully');
      toast({
        title: "Data Loaded",
        description: `Loaded ${slots?.length || 0} time slots and ${schedules?.length || 0} student assignments`,
      });

    } catch (error) {
      console.error('ScheduleManagement: Error during data loading:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred while loading data';
      setError(errorMessage);
      
      toast({
        title: "Loading Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      console.log('ScheduleManagement: Data loading process finished');
    }
  };

  console.log('ScheduleManagement: Rendering with state:', {
    isLoading,
    error,
    timeSlotsCount: timeSlots.length,
    studentSchedulesCount: studentSchedules.length,
    activeTab
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Schedule Management</h1>
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <span className="ml-2">Loading schedule data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Schedule Management</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-3 w-3" />
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
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

      <div className="mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Time Slots: {timeSlots.length}</span>
              <span>Student Assignments: {studentSchedules.length}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={loadData}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
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
