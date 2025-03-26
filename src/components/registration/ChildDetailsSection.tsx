
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationData } from './types';

interface ChildDetailsSectionProps {
  form: UseFormReturn<RegistrationData>;
}

const ChildDetailsSection: React.FC<ChildDetailsSectionProps> = ({ form }) => {
  return (
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
  );
};

export default ChildDetailsSection;
