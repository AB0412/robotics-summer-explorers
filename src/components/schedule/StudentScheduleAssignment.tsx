import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Trash2, Clock, User, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabase/client';
import type { TimeSlot, StudentSchedule, Registration } from '@/types/schedule';

interface StudentScheduleAssignmentProps {
  timeSlots: TimeSlot[];
  studentSchedules: StudentSchedule[];
  onUpdate: () => void;
}

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export const StudentScheduleAssignment: React.FC<StudentScheduleAssignmentProps> = ({
  timeSlots,
  studentSchedules,
  onUpdate,
}) => {
  const { toast } = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dayFilter, setDayFilter] = useState<string>('');

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

  const handleAssignStudent = async () => {
    if (!selectedStudent || !selectedTimeSlot || !selectedDay) {
      toast({
        title: "Validation Error",
        description: "Please select a student, time slot, and day of the week",
        variant: "destructive",
      });
      return;
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
      return;
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

      // Reset form
      setSelectedStudent('');
      setSelectedTimeSlot('');
      setSelectedDay('');
      setNotes('');
      onUpdate();
    } catch (error) {
      console.error('Error assigning student:', error);
      toast({
        title: "Error",
        description: `Failed to assign student to time slot: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveAssignment = async (scheduleId: string) => {
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

    // Apply day filter - fix the logic to handle missing day_of_week values
    let matchesDay = true;
    if (dayFilter) {
      // Only filter if dayFilter is set and schedule has a day_of_week value
      matchesDay = schedule.day_of_week === dayFilter;
    }

    return matchesSearch && matchesDay;
  });

  console.log('Filtered schedules:', filteredSchedules);
  console.log('All schedules:', studentSchedules);
  console.log('Day filter:', dayFilter);

  const groupedSchedules = timeSlots.map(slot => ({
    ...slot,
    assignments: filteredSchedules.filter(s => s.time_slot_id === slot.id)
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading assignments...</span>
      </div>
    );
  }

  // Add debug info for troubleshooting
  console.log('Time slots:', timeSlots);
  console.log('Student schedules:', studentSchedules);
  console.log('Registrations:', registrations);

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {unassignedStudents.map(student => (
                    <SelectItem key={student.registrationid} value={student.registrationid}>
                      {student.childname} (Age {student.childage}, Grade {student.childgrade}) - {student.parentname}
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
                  {timeSlots.map(slot => {
                    const capacity = getTimeSlotCapacity(slot.id);
                    return (
                      <SelectItem 
                        key={slot.id} 
                        value={slot.id}
                        disabled={capacity.available <= 0}
                      >
                        {slot.name} - {slot.start_time} to {slot.end_time} 
                        ({capacity.assigned}/{capacity.total})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="day">Select Day</Label>
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a day..." />
                </SelectTrigger>
                <SelectContent>
                  {daysOfWeek.map(day => (
                    <SelectItem key={day.value} value={day.value}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special notes for this assignment..."
            />
          </div>
          <Button onClick={handleAssignStudent} className="w-full md:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Student
          </Button>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Select value={dayFilter} onValueChange={setDayFilter}>
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

      {/* Assignments by Time Slot */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Assignments</h3>
        {timeSlots.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-center">No time slots configured yet. Please add time slots first.</p>
            </CardContent>
          </Card>
        ) : (
          groupedSchedules.map(slot => {
            const capacity = getTimeSlotCapacity(slot.id);
            return (
              <Card key={slot.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {slot.name}
                    </div>
                    <Badge variant={capacity.available > 0 ? 'default' : 'destructive'}>
                      {capacity.assigned}/{capacity.total} students
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {slot.start_time} - {slot.end_time}
                  </p>
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
                                Age {assignment.registrations?.childage} • Grade {assignment.registrations?.childgrade} • 
                                Parent: {assignment.registrations?.parentname}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-blue-600">
                                <Calendar className="h-3 w-3" />
                                <span>{assignment.day_of_week ? daysOfWeek.find(d => d.value === assignment.day_of_week)?.label : 'Day not specified'}</span>
                              </div>
                              {assignment.notes && (
                                <p className="text-sm text-blue-600 italic">{assignment.notes}</p>
                              )}
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
            );
          })
        )}
      </div>
    </div>
  );
};
