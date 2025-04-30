
import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <div className="mb-3 print:mb-2">
      <h2 className="font-display font-bold text-xl mb-2 text-robotics-navy border-b border-robotics-accent pb-1 print:text-lg print:mb-2">
        Contact Information
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
        <div className="space-y-2 print:space-y-1">
          <p className="font-bold print:text-sm">Program Instructors</p>
          <div className="flex items-start gap-2">
            <Phone className="text-robotics-blue mt-1" size={14} />
            <div>
              <p className="font-medium print:text-sm">Megha Billore</p>
              <p className="text-gray-600 print:text-xs">603-866-0275</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 print:space-y-1">
          <p className="font-bold print:text-sm">Location</p>
          <div className="flex items-start gap-2">
            <MapPin className="text-robotics-blue mt-1" size={14} />
            <p className="print:text-xs">683 Carryduff St NW, Concord - 28027</p>
          </div>
          
          <div className="bg-robotics-navy text-white p-2 rounded-lg print:p-1">
            <p className="font-bold print:text-sm">Limited spots available!</p>
            <p className="text-xs print:text-xs">Call or text to register your child today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
