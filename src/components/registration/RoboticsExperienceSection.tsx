
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues, interestLevels } from './RegistrationTypes';

interface RoboticsExperienceSectionProps {
  form: UseFormReturn<FormValues>;
}

const RoboticsExperienceSection = ({ form }: RoboticsExperienceSectionProps) => {
  const hasPriorExperience = form.watch('hasPriorExperience');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-robotics-navy">4. Robotics Experience</h2>
      <FormDescription className="text-sm text-gray-500">
        This information helps us tailor instruction to your child's experience level
      </FormDescription>

      {/* Prior Robotics Experience */}
      <FormField
        control={form.control}
        name="hasPriorExperience"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Prior Robotics Experience?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-row space-x-4"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="yes" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="no" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">No</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Conditional fields that appear if "Yes" is selected */}
      {hasPriorExperience === 'yes' && (
        <>
          {/* Experience Description */}
          <FormField
            control={form.control}
            name="experienceDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brief Description of Experience</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="E.g., VEX IQ, LEGO SPIKE, school robotics club"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tell us about any robotics kits, classes, or clubs your child has participated in
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interest Level */}
          <FormField
            control={form.control}
            name="interestLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Child's Interest Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select interest level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interestLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  How would you rate your child's interest in robotics?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};

export default RoboticsExperienceSection;
