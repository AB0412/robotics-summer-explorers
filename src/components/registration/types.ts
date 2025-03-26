
import { z } from 'zod';

export const registrationSchema = z.object({
  parentName: z.string().min(2, 'Parent/Guardian name is required'),
  parentEmail: z.string().email('Please enter a valid email'),
  parentPhone: z.string().min(10, 'Please enter a valid phone number'),
  emergencyContact: z.string().min(10, 'Emergency contact information is required'),
  
  childName: z.string().min(2, 'Child\'s full name is required'),
  childAge: z.coerce.number().int().min(5, 'Minimum age is 5').max(18, 'Maximum age is 18'),
  grade: z.string().min(1, 'Grade is required'),
  schoolName: z.string().min(2, 'School name is required'),
  medicalInfo: z.string().optional(),
  
  preferredTiming: z.string(),
  alternateTiming: z.string().optional(),
  
  priorExperience: z.enum(['yes', 'no']),
  experienceDetails: z.string().optional(),
  interestLevel: z.string().optional(),
  
  referralSource: z.string(),
  photoConsent: z.boolean(),
  waiverAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  
  tshirtSize: z.string().optional(),
  specialRequests: z.string().optional(),
  volunteerInterest: z.boolean().optional(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
