import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import type { TimeSlot, StudentSchedule } from '@/types/schedule';

interface ScheduleCalendarViewProps {
  timeSlots: TimeSlot[];
  studentSchedules: StudentSchedule[];
}

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const dayLabels = {
  monday: 'Monday',
  tuesday: 'Tuesday', 
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export const ScheduleCalendarView: React.FC<ScheduleCalendarViewProps> = ({
  timeSlots,
  studentSchedules,
}) => {
  // Group time slots by day
  const scheduleByDay = daysOfWeek.reduce((acc, day) => {
    const slotsForDay = timeSlots
      .filter(slot => slot.days.includes(day))
      .map(slot => ({
        ...slot,
        assignments: studentSchedules.filter(s => s.time_slot_id === slot.id)
      }))
      .sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    acc[day] = slotsForDay;
    return acc;
  }, {} as Record<string, any[]>);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Weekly Schedule Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {daysOfWeek.map(day => (
          <Card key={day} className="h-fit">
            <CardHeader>
              <CardTitle className="text-lg">{dayLabels[day as keyof typeof dayLabels]}</CardTitle>
            </CardHeader>
            <CardContent>
              {scheduleByDay[day].length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">No sessions scheduled</p>
              ) : (
                <div className="space-y-3">
                  {scheduleByDay[day].map(slot => (
                    <div key={slot.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{slot.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {slot.assignments.length}/{slot.max_capacity}
                        </Badge>
                      </div>
                      
                      {slot.description && (
                        <p className="text-xs text-gray-600 mb-2">{slot.description}</p>
                      )}
                      
                      {slot.assignments.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700">Students:</p>
                          <div className="space-y-1">
                            {slot.assignments.slice(0, 3).map((assignment: any) => (
                              <div key={assignment.id} className="text-xs text-gray-600">
                                • {assignment.registrations?.childname}
                              </div>
                            ))}
                            {slot.assignments.length > 3 && (
                              <div className="text-xs text-gray-500 italic">
                                +{slot.assignments.length - 3} more...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
