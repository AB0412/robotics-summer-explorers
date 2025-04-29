
import React from 'react';
import FlyerHeader from './FlyerHeader';
import FlyerHero from './FlyerHero';
import ProgramDetails from './ProgramDetails';
import ImageGrid from './ImageGrid';
import LearningOutcomes from './LearningOutcomes';
import ContactInfo from './ContactInfo';
import FlyerFooter from './FlyerFooter';

interface PrintableContentProps {
  flyerRef: React.RefObject<HTMLDivElement>;
}

const PrintableContent: React.FC<PrintableContentProps> = ({ flyerRef }) => {
  return (
    <div 
      ref={flyerRef}
      className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none print:m-0"
      style={{ maxWidth: "8.5in", minHeight: "11in" }}
    >
      <FlyerHeader />
      <FlyerHero />
      
      <div className="p-6 print:p-4">
        <ProgramDetails />
        <ImageGrid />
        <LearningOutcomes />
        <ContactInfo />
      </div>
      
      <FlyerFooter />
    </div>
  );
};

export default PrintableContent;
