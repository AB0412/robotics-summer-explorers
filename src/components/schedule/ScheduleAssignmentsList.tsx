
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, Trash2 } from 'lucide-react';
import type { TimeSlot, StudentSchedule } from '@/types/schedule';

interface ScheduleAssignmentsListProps {
  timeSlots: TimeSlot[];
  filteredSchedules: StudentSchedule[];
  onRemoveAssignment: (scheduleId: string) => void;
  getTimeSlotCapacity: (timeSlotId: string) => { assigned: number; total: number; available: number };
}

const daysOfWeek = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
];

export const ScheduleAssignmentsList: React.FC<ScheduleAssignmentsListProps> = ({
  timeSlots,
  filteredSchedules,
  onRemoveAssignment,
  getTimeSlotCapacity,
}) => {
  const groupedSchedules = timeSlots.map(slot => ({
    ...slot,
    assignments: filteredSchedules.filter(s => s.time_slot_id === slot.id)
  }));

  if (timeSlots.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Assignments</h3>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-500 text-center">No time slots configured yet. Please add time slots first.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
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
                        onClick={() => onRemoveAssignment(assignment.id)}
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
  );
};
