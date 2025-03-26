
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationData } from './types';

interface LogisticsSectionProps {
  form: UseFormReturn<RegistrationData>;
}

const LogisticsSection: React.FC<LogisticsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Logistics & Consent</h2>
      
      <FormField
        control={form.control}
        name="referralSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How did you hear about us?</FormLabel>
            <FormControl>
              <Input placeholder="Social media, school flyer, friend, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="photoConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Photo Release Consent</FormLabel>
                <FormDescription>
                  I give permission to use photos/videos of my child for promotional purposes
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="waiverAgreement"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Waiver Agreement *</FormLabel>
                <FormDescription>
                  I agree to the terms and conditions. I understand that robotics activities may involve certain risks.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default LogisticsSection;
