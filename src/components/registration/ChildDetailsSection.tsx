
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface ChildDetailsSectionProps {
  form: UseFormReturn<FormValues>;
}

const ChildDetailsSection = ({ form }: ChildDetailsSectionProps) => {
  return (
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
            <FormLabel>Grade (Fall 2025)</FormLabel>
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
  );
};

export default ChildDetailsSection;
