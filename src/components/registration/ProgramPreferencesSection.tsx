
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';

interface ProgramPreferencesSectionProps {
  form: UseFormReturn<FormValues>;
}

const ProgramPreferencesSection = ({ form }: ProgramPreferencesSectionProps) => {
  const programType = form.watch('programType');
  const isSummerCamp = programType === 'summer-camp-2026';

  const batchOptions = isSummerCamp
    ? [
        { value: 'monday-12-1:30', label: 'Monday – 12:00 to 1:30 PM' },
        { value: 'wednesday-12-1:30', label: 'Wednesday – 12:00 to 1:30 PM' },
      ]
    : [
        { value: '4:30-6:00', label: '4:30 PM – 6:00 PM' },
        { value: '6:00-7:30', label: '6:00 PM – 7:30 PM' },
      ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-robotics-navy">3. Program Preferences</h2>
      
      <FormField
        control={form.control}
        name="preferredBatch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Batch Timing</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select preferred timing" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {batchOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="alternateBatch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alternate Timing (if first choice is full)</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select alternate timing (optional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {batchOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
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
