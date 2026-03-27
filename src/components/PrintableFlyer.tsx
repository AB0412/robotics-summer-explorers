
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PrintButton from './flyer/PrintButton';
import PrintableContent from './flyer/PrintableContent';
import PrintStyles from './flyer/PrintStyles';

const PrintableFlyer = () => {
  const flyerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleDownload = async () => {
    if (!flyerRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'in', 'letter');
      const pageWidth = 8.5;
      const pageHeight = 11;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save('Summer-Robotics-Explorers-2026-Flyer.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-letter mx-auto">
        <PrintButton onDownload={handleDownload} isGenerating={isGenerating} />
        <PrintableContent flyerRef={flyerRef} />
      </div>
      
      <PrintStyles />
    </div>
  );
};

export default PrintableFlyer;
