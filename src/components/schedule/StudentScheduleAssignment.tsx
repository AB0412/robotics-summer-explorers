
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Search, Trash2, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/utils/supabase/client';
import type { TimeSlot, StudentSchedule } from '@/pages/ScheduleManagement';

interface StudentScheduleAssignmentProps {
  timeSlots: TimeSlot[];
  studentSchedules: StudentSchedule[];
  onUpdate: () => void;
}

interface Registration {
  registrationid: string;
  childname: string;
  parentname: string;
  childage: string;
  childgrade: string;
  preferredbatch: string;
}

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
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRegistrations();
  }, [studentSchedules]);

  const loadRegistrations = async () => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('registrationid, childname, parentname, childage, childgrade, preferredbatch')
        .order('childname');

      if (error) throw error;

      setRegistrations(data || []);
      
      // Find unassigned students
      const assignedStudentIds = studentSchedules.map(s => s.registration_id);
      const unassigned = (data || []).filter(reg => !assignedStudentIds.includes(reg.registrationid));
      setUnassignedStudents(unassigned);
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
    if (!selectedStudent || !selectedTimeSlot) {
      toast({
        title: "Validation Error",
        description: "Please select both a student and time slot",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('student_schedules')
        .insert([{
          registration_id: selectedStudent,
          time_slot_id: selectedTimeSlot,
          notes: notes || null,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student assigned to time slot successfully",
      });

      // Reset form
      setSelectedStudent('');
      setSelectedTimeSlot('');
      setNotes('');
      onUpdate();
    } catch (error) {
      console.error('Error assigning student:', error);
      toast({
        title: "Error",
        description: "Failed to assign student to time slot",
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
        <span className="ml-2">Loading assignments...</span>
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
                  {unassignedStudents.map(student => (
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

      {/* Search */}
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
      </div>

      {/* Assignments by Time Slot */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Assignments</h3>
        {groupedSchedules.map(slot => {
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
                  {slot.start_time} - {slot.end_time} • {slot.days.join(', ')}
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
                              Grade {assignment.registrations?.childgrade} • 
                              Parent: {assignment.registrations?.parentname}
                            </p>
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
        })}
      </div>
    </div>
  );
};
