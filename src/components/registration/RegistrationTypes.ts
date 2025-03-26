
import { z } from 'zod';

// Define the form validation schema
export const formSchema = z.object({
  // 1. Basic Information
  parentName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  parentEmail: z.string().email({ message: 'Please enter a valid email' }),
  parentPhone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  emergencyContact: z.string().min(5, { message: 'Please provide an emergency contact' }),
  
  // 2. Child Details
  childName: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  childAge: z.string().min(1, { message: 'Age is required' }),
  childGrade: z.string().min(1, { message: 'Grade is required' }),
  schoolName: z.string().min(2, { message: 'School name is required' }),
  medicalInfo: z.string().optional(),
  
  // 3. Program Preferences
  preferredBatch: z.string({
    required_error: "Please select a preferred batch time",
  }),
  alternateBatch: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;
