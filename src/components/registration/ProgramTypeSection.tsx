
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormValues } from './RegistrationTypes';

interface ProgramTypeSectionProps {
  form: UseFormReturn<FormValues>;
}

// Filter out summer program options
const availableProgramTypes = [
  { value: 'regular', label: 'Regular Classes (Aug 2025 - May 2026)' }
];

const ProgramTypeSection = ({ form }: ProgramTypeSectionProps) => {
  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div>
        <h2 className="text-xl font-semibold mb-2">Program Type</h2>
        <p className="text-sm text-gray-600">Please select the program type you're interested in.</p>
      </div>
      
      <FormField
        control={form.control}
        name="programType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Program Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableProgramTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProgramTypeSection;
