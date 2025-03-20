
import React, { useRef } from 'react';
import { Cog, MapPin, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';

const PrintableFlyer = () => {
  const flyerRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 print:hidden">
          <Button onClick={handlePrint} className="bg-robotics-blue hover:bg-robotics-navy">
            Print Flyer
          </Button>
          <p className="mt-2 text-sm text-gray-600">
            Click the button above to print this flyer or save it as PDF
          </p>
        </div>
        
        {/* Printable Flyer */}
        <div 
          ref={flyerRef}
          className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none"
        >
          {/* Header */}
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
          
          {/* Content */}
          <div className="p-8">
            {/* Program Details */}
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
            
            {/* What Students Will Learn */}
            <div className="mb-8">
              <h2 className="font-display font-bold text-2xl mb-4 text-robotics-navy border-b border-robotics-accent pb-2">
                What Students Will Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
                    <Cog size={18} />
                  </div>
                  <div>
                    <p className="font-medium">VEX Robotics</p>
                    <p className="text-gray-600">Build robots with VEX kits and learn programming</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
                    <Cog size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Problem Solving</p>
                    <p className="text-gray-600">Develop critical thinking through challenges</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
                    <Cog size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Coding Basics</p>
                    <p className="text-gray-600">Learn programming fundamentals through robotics</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
                    <Cog size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Teamwork</p>
                    <p className="text-gray-600">Collaborate on projects and presentations</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div>
              <h2 className="font-display font-bold text-2xl mb-4 text-robotics-navy border-b border-robotics-accent pb-2">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <p className="font-bold">Program Instructors</p>
                  <div className="flex items-start gap-3">
                    <Phone className="text-robotics-blue mt-1" size={18} />
                    <div>
                      <p className="font-medium">Avinash Billore</p>
                      <p className="text-gray-600">603-866-0275</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="text-robotics-blue mt-1" size={18} />
                    <div>
                      <p className="font-medium">Megha Billore</p>
                      <p className="text-gray-600">603-930-6748</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="font-bold">Location</p>
                  <div className="flex items-start gap-3">
                    <MapPin className="text-robotics-blue mt-1" size={18} />
                    <p>683 Carryduff St NW, Concord - 28027</p>
                  </div>
                  
                  <div className="bg-robotics-navy text-white p-4 rounded-lg mt-4">
                    <p className="font-bold">Limited spots available!</p>
                    <p className="text-sm">Call or text to register your child today.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-robotics-navy text-white p-4 text-center">
            <p>© 2025 Robotics Summer Explorers. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5cm;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableFlyer;
