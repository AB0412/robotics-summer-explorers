
import React from 'react';
import { Phone, MapPin } from 'lucide-react';

const ContactInfo: React.FC = () => {
  return (
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
              <p className="font-medium">Megha Billore</p>
              <p className="text-gray-600">603-866-0275</p>
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
  );
};

export default ContactInfo;
