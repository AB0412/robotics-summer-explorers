
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus } from 'lucide-react';
import type { TimeSlot, Registration } from '@/types/schedule';

interface StudentAssignmentFormProps {
  timeSlots: TimeSlot[];
  unassignedStudents: Registration[];
  onAssign: (student: string, timeSlot: string, day: string, notes: string) => Promise<boolean>;
  getTimeSlotCapacity: (timeSlotId: string) => { assigned: number; total: number; available: number };
}

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export const StudentAssignmentForm: React.FC<StudentAssignmentFormProps> = ({
  timeSlots,
  unassignedStudents,
  onAssign,
  getTimeSlotCapacity,
}) => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [notes, setNotes] = useState('');

  const handleAssignStudent = async () => {
    const success = await onAssign(selectedStudent, selectedTimeSlot, selectedDay, notes);
    if (success) {
      setSelectedStudent('');
      setSelectedTimeSlot('');
      setSelectedDay('');
      setNotes('');
    }
  };

  return (
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
  );
};
