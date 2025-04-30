
import React from 'react';
import { Cog } from 'lucide-react';

const FlyerHeader: React.FC = () => {
  return (
    <div className="relative bg-robotics-navy text-white p-4 print:p-3">
      <div className="absolute right-0 top-0 opacity-10">
        <Cog size={100} className="text-white" />
      </div>
      <div className="absolute left-0 bottom-0 opacity-10">
        <Cog size={80} className="text-white" />
      </div>
      
      <div className="text-center text-robotics-accent text-sm mb-2 print:text-xs">
        https://bot-venture.com/
      </div>
      
      <h1 className="font-display font-bold text-2xl md:text-3xl print:text-2xl mb-2 relative z-10">
        <span className="text-robotics-accent">S.T.E.A.M</span> Fun with Robotics
      </h1>
      
      <p className="text-lg print:text-base relative z-10">
        Hands-on summer program teaching VEX robotics for elementary students grades 1-5
      </p>
    </div>
  );
};

export default FlyerHeader;
