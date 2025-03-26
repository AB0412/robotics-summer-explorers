
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { RegistrationData } from './types';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<RegistrationData>;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ form }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold text-robotics-navy border-b pb-2">Additional Information (Optional)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="tshirtSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>T-Shirt Size (Optional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select t-shirt size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Select size</SelectItem>
                  <SelectItem value="YS">Youth Small</SelectItem>
                  <SelectItem value="YM">Youth Medium</SelectItem>
                  <SelectItem value="YL">Youth Large</SelectItem>
                  <SelectItem value="AS">Adult Small</SelectItem>
                  <SelectItem value="AM">Adult Medium</SelectItem>
                  <SelectItem value="AL">Adult Large</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>For camp t-shirts</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="specialRequests"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Requests (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="E.g., 'Pair with a friend', 'Need early pickup'" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="volunteerInterest"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox 
                checked={field.value} 
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Volunteer Interest</FormLabel>
              <FormDescription>
                I'd like to help as a volunteer!
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalInfoSection;
