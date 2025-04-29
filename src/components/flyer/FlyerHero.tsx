
import React from 'react';

const FlyerHero: React.FC = () => {
  return (
    <div className="relative h-48 md:h-64 print:h-40 overflow-hidden">
      <img 
        src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e" 
        alt="Kids learning robotics" 
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <h2 className="text-white font-bold text-xl md:text-2xl print:text-xl">Summer Camp 2025</h2>
      </div>
    </div>
  );
};

export default FlyerHero;
