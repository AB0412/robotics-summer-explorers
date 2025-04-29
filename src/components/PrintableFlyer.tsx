
import React, { useRef } from 'react';
import PrintButton from './flyer/PrintButton';
import PrintableContent from './flyer/PrintableContent';
import PrintStyles from './flyer/PrintStyles';

const PrintableFlyer = () => {
  const flyerRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-letter mx-auto">
        <PrintButton onPrint={handlePrint} />
        <PrintableContent flyerRef={flyerRef} />
      </div>
      
      <PrintStyles />
    </div>
  );
};

export default PrintableFlyer;
