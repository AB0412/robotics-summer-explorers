
import React from 'react';
import { Cog, ArrowDown, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-robotics-navy text-white py-20 overflow-hidden">
      {/* Decorative gears */}
      <div className="absolute left-0 top-0 opacity-10">
        <Cog size={200} className="text-white animate-gear-spin" />
      </div>
      <div className="absolute right-0 bottom-0 opacity-10">
        <Cog size={150} className="text-white animate-gear-spin" style={{ animationDirection: 'reverse' }} />
      </div>
      
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            <span className="text-robotics-accent">S.T.E.A.M</span> Fun and Education with Robotics
          </h1>
          
          <p className="text-xl md:text-2xl mb-8">
            Hands-on summer program teaching VEX robotics for elementary students grades 1-5
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg inline-block">
            <h2 className="font-display font-bold text-2xl mb-4">Summer Camp 2025</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="font-bold text-robotics-accent text-xl">8 Weeks</p>
                <p>Summer Program</p>
              </div>
              <div>
                <p className="font-bold text-robotics-accent text-xl">$100</p>
                <p>Per Month</p>
              </div>
              <div>
                <p className="font-bold text-robotics-accent text-xl">1.5 Hours</p>
                <p>Weekly Classes</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-4 text-robotics-accent">
              <MapPin size={18} />
              <span>683 Carryduff St NW, Concord - 28027</span>
            </div>
          </div>
          
          <a href="#about" className="inline-block mt-12 text-white/60 hover:text-white">
            <ArrowDown className="mx-auto animate-bounce" />
            <span className="sr-only">Scroll down</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
