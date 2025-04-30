
import React from 'react';

const ProgramDetails: React.FC = () => {
  return (
    <div className="mb-4 print:mb-3">
      <h2 className="font-display font-bold text-xl mb-2 text-robotics-navy border-b border-robotics-accent pb-1 print:text-lg print:mb-2">
        Program Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:gap-2">
        <div className="border-2 border-robotics-lightblue rounded-lg p-2 text-center">
          <p className="font-bold text-robotics-blue text-base mb-0 print:text-sm">8 Weeks</p>
          <p className="print:text-xs">Summer Program</p>
        </div>
        <div className="border-2 border-robotics-lightblue rounded-lg p-2 text-center">
          <p className="font-bold text-robotics-blue text-base mb-0 print:text-sm">$100</p>
          <p className="print:text-xs">Per Month</p>
        </div>
        <div className="border-2 border-robotics-lightblue rounded-lg p-2 text-center">
          <p className="font-bold text-robotics-blue text-base mb-0 print:text-sm">1.5 Hours</p>
          <p className="print:text-xs">Weekly Classes</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
