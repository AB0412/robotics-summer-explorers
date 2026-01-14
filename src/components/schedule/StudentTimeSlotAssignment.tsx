import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Trash2, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

// Type assertion helper for tables not yet in the schema
const fromTable = (tableName: string) => supabase.from(tableName as any);

interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  days: string[];
  max_capacity: number;
  description: string;
}

interface StudentSchedule {
  id: string;
  registration_id: string;
  time_slot_id: string;
  assigned_at: string;
  registrations?: {
    childname: string;
    parentname: string;
    childage: string;
    childgrade: string;
  };
  program_time_slots?: TimeSlot;
}

interface Registration {
  registrationid: string;
  childname: string;
  parentname: string;
  childage: string;
  childgrade: string;
}

export const StudentTimeSlotAssignment: React.FC = () => {
  const { toast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [studentSchedules, setStudentSchedules] = useState<StudentSchedule[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load time slots
      const { data: slots, error: slotsError } = await fromTable('program_time_slots')
        .select('*')
        .order('start_time');

      if (slotsError) throw slotsError;
      setTimeSlots((slots as unknown as TimeSlot[]) || []);

      // Load registrations
      const { data: regs, error: regsError } = await supabase
        .from('registrations')
        .select('registrationid, childname, parentname, childage, childgrade')
        .order('childname');

      if (regsError) throw regsError;
      setRegistrations((regs as unknown as Registration[]) || []);

      // Load student schedules
      const { data: schedules, error: schedulesError } = await fromTable('student_schedules')
        .select(`
          *,
          registrations(childname, parentname, childage, childgrade),
          program_time_slots(*)
        `)
        .order('assigned_at', { ascending: false });

      if (schedulesError) throw schedulesError;
      setStudentSchedules((schedules as unknown as StudentSchedule[]) || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignStudent = async () => {
    if (!selectedStudent || !selectedTimeSlot) {
      toast({
        title: "Validation Error",
        description: "Please select both a student and time slot",
        variant: "destructive",
      });
      return;
    }

    // Check if student is already assigned to this time slot
    const existingAssignment = studentSchedules.find(
      s => s.registration_id === selectedStudent && s.time_slot_id === selectedTimeSlot
    );

    if (existingAssignment) {
      toast({
        title: "Already Assigned",
        description: "This student is already assigned to this time slot",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await fromTable('student_schedules')
        .insert([{
          registration_id: selectedStudent,
          time_slot_id: selectedTimeSlot,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student assigned successfully",
      });

      setSelectedStudent('');
      setSelectedTimeSlot('');
      loadData();
    } catch (error) {
      console.error('Error assigning student:', error);
      toast({
        title: "Error",
        description: "Failed to assign student",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAssignment = async (scheduleId: string) => {
    if (!confirm('Are you sure you want to remove this assignment?')) {
      return;
    }

    try {
      const { error } = await fromTable('student_schedules')
        .delete()
        .eq('id', scheduleId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Assignment removed successfully",
      });
      loadData();
    } catch (error) {
      console.error('Error removing assignment:', error);
      toast({
        title: "Error",
        description: "Failed to remove assignment",
        variant: "destructive",
      });
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAssignedStudentIds = () => {
    return studentSchedules.map(s => s.registration_id);
  };

  const getAvailableStudents = () => {
    const assignedIds = getAssignedStudentIds();
    return registrations.filter(reg => !assignedIds.includes(reg.registrationid));
  };

  const filteredSchedules = studentSchedules.filter(schedule => {
    if (!searchTerm) return true;
    const student = schedule.registrations;
    return (
      student?.childname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student?.parentname.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const groupedSchedules = timeSlots.map(slot => ({
    ...slot,
    assignments: filteredSchedules.filter(s => s.time_slot_id === slot.id)
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Assign Student to Time Slot
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableStudents().map(student => (
                    <SelectItem key={student.registrationid} value={student.registrationid}>
                      {student.childname} (Grade {student.childgrade}) - {student.parentname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="timeslot">Select Time Slot</Label>
              <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a time slot..." />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot.id} value={slot.id}>
                      {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleAssignStudent} className="w-full md:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Student
          </Button>
        </CardContent>
      </Card>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search assigned students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Student Assignments</h3>
        {groupedSchedules.map(slot => (
          <Card key={slot.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                </div>
                <Badge variant="default">
                  {slot.assignments.length} students assigned
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">{slot.description}</p>
            </CardHeader>
            <CardContent>
              {slot.assignments.length === 0 ? (
                <p className="text-gray-500 italic">No students assigned yet</p>
              ) : (
                <div className="space-y-2">
                  {slot.assignments.map(assignment => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{assignment.registrations?.childname}</p>
                          <p className="text-sm text-gray-600">
                            Grade {assignment.registrations?.childgrade} • 
                            Parent: {assignment.registrations?.parentname}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveAssignment(assignment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
