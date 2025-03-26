
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface BasicInfoSectionProps {
  form: UseFormReturn<FormValues>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
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
  );
};

export default BasicInfoSection;
