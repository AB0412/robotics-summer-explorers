
import React from 'react';

const ProgramDetails: React.FC = () => {
  return (
    <div className="mb-4 print:mb-3">
      <h2 className="font-display font-bold text-xl mb-2 text-robotics-navy border-b border-robotics-accent pb-1 print:text-lg print:mb-2">
        Program Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:gap-2 mb-3 print:mb-2">
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

      <div className="space-y-2 print:space-y-1">
        <div className="border-l-4 border-robotics-blue pl-3 py-1">
          <p className="font-bold text-robotics-navy text-sm print:text-xs">VEX IQ Challenge</p>
          <p className="text-xs print:text-[10px] text-gray-600">Entry-level competition for elementary and middle school students. Teams build and program robots to complete a yearly game in cooperation with alliance partners.</p>
        </div>
        <div className="border-l-4 border-robotics-accent pl-3 py-1">
          <p className="font-bold text-robotics-navy text-sm print:text-xs">VEX Robotics Competition (VRC)</p>
          <p className="text-xs print:text-[10px] text-gray-600">Middle and high school pathway using advanced VEX systems to design, build, and program larger robots for a new game each season.</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
