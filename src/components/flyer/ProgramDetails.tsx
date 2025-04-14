
import React from 'react';

const ProgramDetails: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="font-display font-bold text-2xl mb-4 text-robotics-navy border-b border-robotics-accent pb-2">
        Summer Camp 2025
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="border-2 border-robotics-lightblue rounded-lg p-4 text-center">
          <p className="font-bold text-robotics-blue text-xl mb-1">8 Weeks</p>
          <p>Summer Program</p>
        </div>
        <div className="border-2 border-robotics-lightblue rounded-lg p-4 text-center">
          <p className="font-bold text-robotics-blue text-xl mb-1">$100</p>
          <p>Per Month</p>
        </div>
        <div className="border-2 border-robotics-lightblue rounded-lg p-4 text-center">
          <p className="font-bold text-robotics-blue text-xl mb-1">1.5 Hours</p>
          <p>Weekly Classes</p>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;
