
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface ProgramPreferencesSectionProps {
  form: UseFormReturn<FormValues>;
}

const ProgramPreferencesSection = ({ form }: ProgramPreferencesSectionProps) => {
  return (
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
  );
};

export default ProgramPreferencesSection;
