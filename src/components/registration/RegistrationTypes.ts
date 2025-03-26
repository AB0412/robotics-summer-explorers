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

  // 4. Robotics Experience
  hasPriorExperience: z.enum(['yes', 'no'], {
    required_error: "Please select an option",
  }),
  experienceDescription: z.string().optional(),
  interestLevel: z.string().optional(),
  
  // 5. Logistics & Consent
  referralSource: z.string().min(1, { message: 'Please tell us how you heard about us' }),
  photoConsent: z.boolean().default(false),
  waiverAgreement: z.boolean({
    required_error: "You must agree to the terms and conditions",
  }).refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  
  // Bonus Fields
  tShirtSize: z.string().optional(),
  specialRequests: z.string().optional(),
  volunteerInterest: z.boolean().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

// Experience level options
export const interestLevels = [
  { value: "1", label: "1 - Novice (First-time learner)" },
  { value: "2", label: "2 - Beginner (Some interest)" },
  { value: "3", label: "3 - Interested (Moderate experience)" },
  { value: "4", label: "4 - Enthusiast (Regular participation)" },
  { value: "5", label: "5 - Already loves robotics!" },
];

// T-shirt size options
export const tShirtSizes = [
  { value: "ys", label: "Youth Small" },
  { value: "ym", label: "Youth Medium" },
  { value: "yl", label: "Youth Large" },
  { value: "as", label: "Adult Small" },
  { value: "am", label: "Adult Medium" },
  { value: "al", label: "Adult Large" },
  { value: "axl", label: "Adult XL" },
];

// Referral source options
export const referralSources = [
  { value: "social-media", label: "Social Media" },
  { value: "school-flyer", label: "School Flyer" },
  { value: "friend", label: "Friend or Family" },
  { value: "search", label: "Internet Search" },
  { value: "returning", label: "Returning Student" },
  { value: "other", label: "Other" },
];

// Payment method options - keeping this for reference even though we're not using the form field anymore
export const paymentMethods = [
  { value: "zelle", label: "Zelle" },
  { value: "cheque", label: "Cheque" },
  { value: "cash", label: "Cash" },
];
