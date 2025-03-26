
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationData } from './types';

interface RoboticsExperienceSectionProps {
  form: UseFormReturn<RegistrationData>;
  showExperienceDetails: boolean;
  setShowExperienceDetails: (show: boolean) => void;
}

const RoboticsExperienceSection: React.FC<RoboticsExperienceSectionProps> = ({ 
  form, 
  showExperienceDetails, 
  setShowExperienceDetails 
}) => {
  return (
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
  );
};

export default RoboticsExperienceSection;
