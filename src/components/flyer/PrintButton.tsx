
import React from 'react';
import { Button } from '../ui/button';
import { Download } from 'lucide-react';

interface PrintButtonProps {
  onDownload: () => void;
  isGenerating?: boolean;
}

const PrintButton: React.FC<PrintButtonProps> = ({ onDownload, isGenerating }) => {
  return (
    <div className="mb-6 print:hidden">
      <Button onClick={onDownload} className="bg-robotics-blue hover:bg-robotics-navy" disabled={isGenerating}>
        <Download size={18} className="mr-2" />
        {isGenerating ? 'Generating PDF...' : 'Download Flyer'}
      </Button>
      <p className="mt-2 text-sm text-gray-600">
        Click the button above to download the flyer as a PDF
      </p>
    </div>
  );
};

export default PrintButton;
