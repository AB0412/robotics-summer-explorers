
import React from 'react';

const ProgramDetails: React.FC = () => {
  return (
    <div className="mb-6 print:mb-4">
      <h2 className="font-display font-bold text-2xl mb-3 text-robotics-navy border-b border-robotics-accent pb-2 print:text-xl print:mb-2">
        Summer Camp 2025
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:gap-3">
        <div className="border-2 border-robotics-lightblue rounded-lg p-3 text-center">
          <p className="font-bold text-robotics-blue text-lg mb-1">8 Weeks</p>
          <p className="print:text-sm">Summer Program</p>
        </div>
        <div className="border-2 border-robotics-lightblue rounded-lg p-3 text-center">
          <p className="font-bold text-robotics-blue text-lg mb-1">$100</p>
          <p className="print:text-sm">Per Month</p>
        </div>
        <div className="border-2 border-robotics-lightblue rounded-lg p-3 text-center">
          <p className="font-bold text-robotics-blue text-lg mb-1">1.5 Hours</p>
          <p className="print:text-sm">Weekly Classes</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
