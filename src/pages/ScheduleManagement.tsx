
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Users } from 'lucide-react';
import { StudentTimeSlotAssignment } from '@/components/schedule/StudentTimeSlotAssignment';
import { ScheduleCalendarView } from '@/components/schedule/ScheduleCalendarView';

const ScheduleManagement = () => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'calendar'>('assignments');

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

      {activeTab === 'assignments' && <StudentTimeSlotAssignment />}
      {activeTab === 'calendar' && <ScheduleCalendarView timeSlots={[]} studentSchedules={[]} />}
    </div>
  );
};

export default ScheduleManagement;
