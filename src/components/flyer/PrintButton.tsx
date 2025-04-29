
import React from 'react';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onPrint: () => void;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onPrint }) => {
  return (
    <div className="mb-6 print:hidden">
      <Button onClick={onPrint} className="bg-robotics-blue hover:bg-robotics-navy">
        <Printer size={18} className="mr-2" />
        Print Flyer
      </Button>
      <p className="mt-2 text-sm text-gray-600">
        Click the button above to print this flyer or save it as PDF
      </p>
    </div>
  );
};

export default PrintButton;
