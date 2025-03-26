
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

// Define the form validation schema
const formSchema = z.object({
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

type FormValues = z.infer<typeof formSchema>;

const RegistrationForm = () => {
  const { toast } = useToast();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContact: '',
      childName: '',
      childAge: '',
      childGrade: '',
      schoolName: '',
      medicalInfo: '',
      preferredBatch: '',
      alternateBatch: '',
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log('Form submitted:', data);
    
    // Show success toast
    toast({
      title: "Registration Submitted",
      description: "Thank you for your registration!",
    });
    
    // Reset form
    form.reset();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-robotics-navy">1. Basic Information</h2>
            
            {/* Parent/Guardian Name */}
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent Email */}
            <FormField
              control={form.control}
              name="parentEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Parent Phone */}
            <FormField
              control={form.control}
              name="parentPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Emergency Contact */}
            <FormField
              control={form.control}
              name="emergencyContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emergency Contact Name & Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe: (123) 456-7890" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide a name and phone number for emergency contact
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Section 2: Child Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-robotics-navy">2. Child Details</h2>
            
            {/* Child's Full Name */}
            <FormField
              control={form.control}
              name="childName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child's Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Child's Age */}
            <FormField
              control={form.control}
              name="childAge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" min="5" max="18" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Grade */}
            <FormField
              control={form.control}
              name="childGrade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade (Fall 2024)</FormLabel>
                  <FormControl>
                    <Input placeholder="Grade" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* School Name */}
            <FormField
              control={form.control}
              name="schoolName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School Name</FormLabel>
                  <FormControl>
                    <Input placeholder="School Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Medical Info */}
            <FormField
              control={form.control}
              name="medicalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies/Medical Conditions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please list any allergies or medical conditions we should be aware of"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional, but important for safety</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Section 3: Program Preferences */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-robotics-navy">3. Program Preferences</h2>
            
            {/* Preferred Batch */}
            <FormField
              control={form.control}
              name="preferredBatch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Batch Timing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred timing" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12:00-1:30">12:00 PM – 1:30 PM</SelectItem>
                      <SelectItem value="4:30-6:00">4:30 PM – 6:00 PM</SelectItem>
                      <SelectItem value="6:00-7:30">6:00 PM – 7:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Alternate Batch */}
            <FormField
              control={form.control}
              name="alternateBatch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alternate Timing (if first choice is full)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alternate timing (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12:00-1:30">12:00 PM – 1:30 PM</SelectItem>
                      <SelectItem value="4:30-6:00">4:30 PM – 6:00 PM</SelectItem>
                      <SelectItem value="6:00-7:30">6:00 PM – 7:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy"
          >
            Submit Registration
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegistrationForm;
