
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationData } from './types';

interface ProgramPreferencesSectionProps {
  form: UseFormReturn<RegistrationData>;
}

const ProgramPreferencesSection: React.FC<ProgramPreferencesSectionProps> = ({ form }) => {
  return (
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
  );
};

export default ProgramPreferencesSection;
