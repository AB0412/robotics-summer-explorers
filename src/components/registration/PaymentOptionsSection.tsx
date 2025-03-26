
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormValues, paymentMethods } from './RegistrationTypes';
import { DollarSign } from 'lucide-react';

interface PaymentOptionsSectionProps {
  form: UseFormReturn<FormValues>;
}

const PaymentOptionsSection: React.FC<PaymentOptionsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4 p-4 bg-cyan-50 rounded-md">
      <div className="flex items-center space-x-2 mb-4">
        <DollarSign className="w-5 h-5 text-robotics-navy" />
        <h3 className="text-lg font-semibold text-robotics-navy">Payment Options</h3>
      </div>
      
      <FormField
        control={form.control}
        name="paymentMethod"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Payment Method <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                {paymentMethods.map((method) => (
                  <div key={method.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.value} id={`payment-${method.value}`} />
                    <FormLabel htmlFor={`payment-${method.value}`} className="font-normal cursor-pointer">
                      {method.label}
                    </FormLabel>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-4 p-3 bg-white rounded-md text-sm">
        <p className="font-medium">Important Payment Information:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
          <li>Zelle payments should be sent to robotics@example.com</li>
          <li>Cheques should be made payable to "Summer Robotics Program"</li>
          <li>Cash payments can be made on the first day of the program</li>
          <li>Full payment is required to confirm registration</li>
        </ul>
      </div>
    </div>
  );
};

export default PaymentOptionsSection;
