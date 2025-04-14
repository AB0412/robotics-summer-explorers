
import React from 'react';
import { Cog } from 'lucide-react';

const FlyerHeader: React.FC = () => {
  return (
    <div className="relative bg-robotics-navy text-white p-8">
      <div className="absolute right-0 top-0 opacity-10">
        <Cog size={150} className="text-white" />
      </div>
      <div className="absolute left-0 bottom-0 opacity-10">
        <Cog size={120} className="text-white" />
      </div>
      
      <h1 className="font-display font-bold text-3xl md:text-4xl mb-4 relative z-10">
        <span className="text-robotics-accent">S.T.E.A.M</span> Fun and Education with Robotics
      </h1>
      
      <p className="text-xl relative z-10">
        Hands-on summer program teaching VEX robotics for elementary students grades 1-5
      </p>
    </div>
  );
};

export default FlyerHeader;
