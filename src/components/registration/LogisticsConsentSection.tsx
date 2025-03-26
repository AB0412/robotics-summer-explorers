
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues, tShirtSizes, referralSources } from './RegistrationTypes';

interface LogisticsConsentSectionProps {
  form: UseFormReturn<FormValues>;
}

const LogisticsConsentSection = ({ form }: LogisticsConsentSectionProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-robotics-navy">5. Logistics & Consent</h2>
      
      {/* Referral Source */}
      <FormField
        control={form.control}
        name="referralSource"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How did you hear about us?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select referral source" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {referralSources.map((source) => (
                  <SelectItem key={source.value} value={source.value}>
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Photo Release Consent */}
      <FormField
        control={form.control}
        name="photoConsent"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Photo Release Consent
              </FormLabel>
              <FormDescription>
                I grant permission for my child to be photographed or recorded during program activities. 
                These materials may be used for promotional purposes including social media, website, and printed materials.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
      
      {/* Waiver Agreement */}
      <FormField
        control={form.control}
        name="waiverAgreement"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Waiver Agreement
              </FormLabel>
              <FormDescription>
                I agree to the terms and conditions of the program, including liability waiver, 
                acknowledgment of activities and risks, and consent for emergency medical treatment if needed. 
                Students are advised to bring a laptop or tablet if available for take-home assignments.
              </FormDescription>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h2 className="text-xl font-bold text-robotics-navy pt-4">Additional Information (Optional)</h2>
      
      {/* T-Shirt Size */}
      <FormField
        control={form.control}
        name="tShirtSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>T-Shirt Size (if providing uniforms/swag)</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select t-shirt size (optional)" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {tShirtSizes.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>Optional</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Special Requests */}
      <FormField
        control={form.control}
        name="specialRequests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests</FormLabel>
            <FormControl>
              <Textarea
                placeholder="E.g., 'Pair with a friend', 'Need early pickup'"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>Optional</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Volunteer Interest */}
      <FormField
        control={form.control}
        name="volunteerInterest"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Volunteer Interest
              </FormLabel>
              <FormDescription>
                I'd like to help as a volunteer during the program! Please contact me with details.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default LogisticsConsentSection;
