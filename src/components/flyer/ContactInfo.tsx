
import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
    <div className="mb-4 print:mb-3">
      <h2 className="font-display font-bold text-2xl mb-3 text-robotics-navy border-b border-robotics-accent pb-2 print:text-xl print:mb-2">
        Contact Information
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-3">
        <div className="space-y-3 print:space-y-2">
          <p className="font-bold print:text-sm">Program Instructors</p>
          <div className="flex items-start gap-2">
            <Phone className="text-robotics-blue mt-1" size={16} />
            <div>
              <p className="font-medium print:text-sm">Megha Billore</p>
              <p className="text-gray-600 print:text-xs">603-866-0275</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 print:space-y-2">
          <p className="font-bold print:text-sm">Location</p>
          <div className="flex items-start gap-2">
            <MapPin className="text-robotics-blue mt-1" size={16} />
            <p className="print:text-xs">683 Carryduff St NW, Concord - 28027</p>
          </div>
          
          <div className="bg-robotics-navy text-white p-3 rounded-lg print:p-2">
            <p className="font-bold print:text-sm">Limited spots available!</p>
            <p className="text-sm print:text-xs">Call or text to register your child today.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
