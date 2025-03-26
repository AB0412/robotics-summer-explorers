
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';

// Define the registration schema
const registrationSchema = z.object({
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

const RegistrationForm = () => {
  const { toast } = useToast();
  const [showExperienceDetails, setShowExperienceDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      parentName: '',
      parentEmail: '',
      parentPhone: '',
      emergencyContact: '',
      childName: '',
      childAge: undefined,
      grade: '',
      schoolName: '',
      medicalInfo: '',
      preferredTiming: '12:00 PM – 1:30 PM',
      alternateTiming: '',
      priorExperience: 'no',
      experienceDetails: '',
      interestLevel: '3',
      referralSource: '',
      photoConsent: false,
      waiverAgreement: false,
      tshirtSize: '',
      specialRequests: '',
      volunteerInterest: false,
    },
  });

  const onSubmit = async (data: RegistrationData) => {
    setIsSubmitting(true);
    try {
      // Get existing registrations from localStorage
      const existingData = localStorage.getItem('registrations');
      const registrations = existingData ? JSON.parse(existingData) : [];
      
      // Add unique ID to the registration
      const newRegistration = {
        ...data,
        id: Date.now().toString(),
        registrationDate: new Date().toISOString(),
      };
      
      // Add new registration and save back to localStorage
      registrations.push(newRegistration);
      localStorage.setItem('registrations', JSON.stringify(registrations));
      
      // Simulate sending confirmation email
      console.log('Sending confirmation email to:', data.parentEmail);
      
      // Show success toast
      toast({
        title: "Registration Successful",
        description: `Thank you for registering ${data.childName}. A confirmation email has been sent to ${data.parentEmail}.`,
      });
      
      // Reset form
      form.reset();
      setShowExperienceDetails(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg mb-10">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Section 1: Parent/Guardian Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Parent/Guardian Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="parentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent/Guardian Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="parentEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="(000) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact (Name & Phone) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Name: (000) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 2: Child Details */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Child Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="childName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Child's Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age *</FormLabel>
                      <FormControl>
                        <Input type="number" min={5} max={18} placeholder="Age" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade (Fall 2024) *</FormLabel>
                      <FormControl>
                        <Input placeholder="Grade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schoolName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="School Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="medicalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allergies/Medical Conditions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please list any allergies or medical conditions we should be aware of (optional)" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>This information will help us ensure your child's safety</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Section 3: Program Preferences */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Program Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="preferredTiming"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Batch Timing *</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="12:00 PM – 1:30 PM">12:00 PM – 1:30 PM</SelectItem>
                          <SelectItem value="4:30 PM – 6:00 PM">4:30 PM – 6:00 PM</SelectItem>
                          <SelectItem value="6:00 PM – 7:30 PM">6:00 PM – 7:30 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alternateTiming"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Timing (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select alternate time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          <SelectItem value="12:00 PM – 1:30 PM">12:00 PM – 1:30 PM</SelectItem>
                          <SelectItem value="4:30 PM – 6:00 PM">4:30 PM – 6:00 PM</SelectItem>
                          <SelectItem value="6:00 PM – 7:30 PM">6:00 PM – 7:30 PM</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>If your first choice is full</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Section 4: Robotics Experience */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Robotics Experience</h2>
              
              <FormField
                control={form.control}
                name="priorExperience"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Prior Robotics Experience?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => {
                          field.onChange(value);
                          setShowExperienceDetails(value === 'yes');
                        }}
                        defaultValue={field.value}
                        className="flex flex-row space-x-6"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="yes" />
                          </FormControl>
                          <FormLabel className="font-normal">Yes</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="no" />
                          </FormControl>
                          <FormLabel className="font-normal">No</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {showExperienceDetails && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="experienceDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brief Experience Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="e.g., VEX IQ, LEGO SPIKE, school club" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interestLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Child's Interest Level (1-5)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interest level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Novice/New to robotics</SelectItem>
                            <SelectItem value="2">2 - Some interest</SelectItem>
                            <SelectItem value="3">3 - Moderately interested</SelectItem>
                            <SelectItem value="4">4 - Very interested</SelectItem>
                            <SelectItem value="5">5 - Already loves robotics!</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Section 5: Logistics & Consent */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Logistics & Consent</h2>
              
              <FormField
                control={form.control}
                name="referralSource"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How did you hear about us?</FormLabel>
                    <FormControl>
                      <Input placeholder="Social media, school flyer, friend, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="photoConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Photo Release Consent</FormLabel>
                        <FormDescription>
                          I give permission to use photos/videos of my child for promotional purposes
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waiverAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Waiver Agreement *</FormLabel>
                        <FormDescription>
                          I agree to the terms and conditions. I understand that robotics activities may involve certain risks.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bonus Fields */}
            <div className="space-y-6">
              <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Additional Information (Optional)</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tshirtSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>T-Shirt Size (Optional)</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select t-shirt size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Select size</SelectItem>
                          <SelectItem value="YS">Youth Small</SelectItem>
                          <SelectItem value="YM">Youth Medium</SelectItem>
                          <SelectItem value="YL">Youth Large</SelectItem>
                          <SelectItem value="AS">Adult Small</SelectItem>
                          <SelectItem value="AM">Adult Medium</SelectItem>
                          <SelectItem value="AL">Adult Large</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>For camp t-shirts</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="E.g., 'Pair with a friend', 'Need early pickup'" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="volunteerInterest"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Volunteer Interest</FormLabel>
                      <FormDescription>
                        I'd like to help as a volunteer!
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="border-t pt-6 flex justify-center">
              <Button 
                type="submit" 
                className="bg-robotics-accent hover:bg-robotics-lightblue text-white px-8 py-2 rounded-md text-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Register Now"}
              </Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-bold text-robotics-navy mb-2">What to Bring:</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Laptop or tablet (if available) for take-home assignments</li>
                <li>Water bottle</li>
                <li>Enthusiasm and creativity!</li>
              </ul>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RegistrationForm;
