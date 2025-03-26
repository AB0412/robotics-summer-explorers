
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationData } from './types';

interface ParentInfoSectionProps {
  form: UseFormReturn<RegistrationData>;
}

const ParentInfoSection: React.FC<ParentInfoSectionProps> = ({ form }) => {
  return (
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
  );
};

export default ParentInfoSection;
