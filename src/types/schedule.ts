
export interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  days: string[];
  max_capacity: number;
  description: string;
}

export interface StudentSchedule {
  id: string;
  registration_id: string;
  time_slot_id: string;
  day_of_week?: string;
  assigned_at: string;
  notes?: string;
  registrations?: {
    childname: string;
    parentname: string;
    childage: string;
    childgrade: string;
  };
  program_time_slots?: TimeSlot;
}

export interface Registration {
  registrationid: string;
  childname: string;
  parentname: string;
  childage: string;
  childgrade: string;
  preferredbatch?: string;
}
