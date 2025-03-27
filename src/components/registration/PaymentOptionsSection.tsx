
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './RegistrationTypes';
import { DollarSign } from 'lucide-react';

interface PaymentOptionsSectionProps {
  form: UseFormReturn<FormValues>;
}

const PaymentOptionsSection: React.FC<PaymentOptionsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-4 p-4 bg-cyan-50 rounded-md">
      <div className="flex items-center space-x-2 mb-4">
        <DollarSign className="w-5 h-5 text-robotics-navy" />
        <h3 className="text-lg font-semibold text-robotics-navy">Payment Information</h3>
      </div>
      
      <div className="p-4 bg-white rounded-md text-sm">
        <p className="font-medium mb-2">Payment Options:</p>
        <ul className="list-disc list-inside mt-2 space-y-2 text-gray-700">
          <li><span className="font-medium">Zelle:</span> robotics@example.com</li>
          <li><span className="font-medium">Cheque:</span> Made payable to "Summer Robotics Program"</li>
          <li><span className="font-medium">Cash:</span> Can be made on the first day of the program</li>
        </ul>
        <div className="mt-4 text-robotics-navy font-medium">
          <p className="text-sm italic">Please include your child's name in the payment reference/memo</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsSection;
