
import React from 'react';

const FlyerHero: React.FC = () => {
  // Remove the hero image component entirely for printing
  return (
    <div className="relative bg-robotics-blue text-white p-3 print:p-2">
      <div className="text-center">
        <h2 className="text-white font-bold text-xl md:text-2xl print:text-xl">Summer Camp 2025</h2>
        <p className="text-white/90 text-sm mt-1">Hands-on Learning for Elementary Students</p>
      </div>
    </div>
  );
};

export default FlyerHero;
