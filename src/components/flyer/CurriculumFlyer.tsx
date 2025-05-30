
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';

const CurriculumFlyer = () => {
  const flyerRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-letter mx-auto">
        {/* Print/Download Controls */}
        <div className="mb-6 print:hidden flex gap-4 justify-center">
          <Button onClick={handlePrint} className="bg-robotics-blue hover:bg-robotics-navy">
            <Printer size={18} className="mr-2" />
            Print Flyer
          </Button>
          <Button onClick={handleDownload} variant="outline" className="border-robotics-blue text-robotics-blue hover:bg-robotics-blue hover:text-white">
            <Download size={18} className="mr-2" />
            Download PDF
          </Button>
        </div>
        
        {/* Printable Content */}
        <div 
          ref={flyerRef}
          className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none print:m-0"
          style={{ maxWidth: "8.5in" }}
        >
          {/* Header */}
          <div className="relative bg-robotics-navy text-white p-6 print:p-4">
            <div className="text-center">
              <h1 className="font-display font-bold text-3xl mb-2 text-robotics-accent print:text-2xl">
                Robotics Program Curriculum
              </h1>
              <p className="text-lg print:text-base">
                Month-by-Month Learning Journey for Young Engineers
              </p>
              <div className="text-robotics-accent text-sm mt-2 print:text-xs">
                https://bot-venture.com/curriculum
              </div>
            </div>
          </div>

          {/* Program Overview */}
          <div className="p-6 print:p-4 bg-gray-50">
            <h2 className="font-display font-bold text-xl mb-4 text-robotics-navy print:text-lg">
              Program Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2">
              <div className="bg-white p-4 rounded-lg border-2 border-robotics-lightblue print:p-2">
                <p className="font-bold text-robotics-blue text-lg mb-1 print:text-base">9 Months</p>
                <p className="text-sm print:text-xs">August 2025 - May 2026</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-robotics-lightblue print:p-2">
                <p className="font-bold text-robotics-blue text-lg mb-1 print:text-base">VEX Robotics</p>
                <p className="text-sm print:text-xs">Professional Platform</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-2 border-robotics-lightblue print:p-2">
                <p className="font-bold text-robotics-blue text-lg mb-1 print:text-base">Max 6 Students</p>
                <p className="text-sm print:text-xs">Per Class</p>
              </div>
            </div>
          </div>

          {/* Curriculum Grid */}
          <div className="p-6 print:p-4">
            <h2 className="font-display font-bold text-xl mb-6 text-robotics-navy print:text-lg print:mb-4">
              Monthly Curriculum Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 print:gap-2">
              {/* August */}
              <div className="bg-blue-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 August (3 Weeks)</h3>
                <p className="font-medium mb-2 print:text-sm">Getting Started with VEX</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Introduction to Robotics</li>
                  <li>• VEX EXP kit basics</li>
                  <li>• Introduction to VEXcode</li>
                </ul>
              </div>

              {/* September */}
              <div className="bg-green-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 September</h3>
                <p className="font-medium mb-2 print:text-sm">Mechanics & Drive Systems</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Gears, pulleys, and motion</li>
                  <li>• Building drive systems</li>
                  <li>• Programming drive control</li>
                  <li>• Mini challenge – Navigation</li>
                </ul>
              </div>

              {/* October */}
              <div className="bg-yellow-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 October</h3>
                <p className="font-medium mb-2 print:text-sm">Sensors & Smart Programming</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Introduction to sensors</li>
                  <li>• Sensor integration in code</li>
                  <li>• Looping & conditional logic</li>
                  <li>• Autonomous navigation</li>
                </ul>
              </div>

              {/* November */}
              <div className="bg-purple-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 November</h3>
                <p className="font-medium mb-2 print:text-sm">Team Collaboration</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Team formation and roles</li>
                  <li>• Design process & sketching</li>
                  <li>• Building arm/lift mechanisms</li>
                  <li>• Iterating designs</li>
                </ul>
              </div>

              {/* December */}
              <div className="bg-red-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 December</h3>
                <p className="font-medium mb-2 print:text-sm">Strategy & Mini Challenges</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Game-based strategy</li>
                  <li>• Autonomous + driver control</li>
                  <li>• Winter Break: Dec 15 - Jan 5</li>
                </ul>
              </div>

              {/* January */}
              <div className="bg-indigo-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 January</h3>
                <p className="font-medium mb-2 print:text-sm">Full Robot Build Phase</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Design final robot</li>
                  <li>• Building & programming</li>
                  <li>• Testing & refinement</li>
                </ul>
              </div>

              {/* February */}
              <div className="bg-pink-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 February</h3>
                <p className="font-medium mb-2 print:text-sm">Advanced Coding</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Variables & functions</li>
                  <li>• Tuning autonomous routines</li>
                  <li>• Practice matches</li>
                </ul>
              </div>

              {/* March */}
              <div className="bg-teal-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 March</h3>
                <p className="font-medium mb-2 print:text-sm">Mock Competition Prep</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Strategy refinement</li>
                  <li>• Judging rubric review</li>
                  <li>• Internal mock tournament</li>
                </ul>
              </div>

              {/* April */}
              <div className="bg-orange-50 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 April</h3>
                <p className="font-medium mb-2 print:text-sm">Engineering Notebook</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Documentation skills</li>
                  <li>• Design improvements</li>
                  <li>• Presentation development</li>
                </ul>
              </div>

              {/* May */}
              <div className="bg-gray-100 p-4 rounded-lg border print:p-2">
                <h3 className="font-bold text-robotics-navy mb-2 print:text-sm">🔹 May</h3>
                <p className="font-medium mb-2 print:text-sm">Final Project Showcase</p>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Final testing & polish</li>
                  <li>• Showcase event for families</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="p-6 print:p-4 bg-gray-50">
            <h2 className="font-display font-bold text-xl mb-4 text-robotics-navy print:text-lg">
              Key Learning Outcomes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
              <div>
                <h3 className="font-bold mb-2 text-robotics-blue print:text-sm">Technical Skills</h3>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Robot building and design</li>
                  <li>• Programming fundamentals</li>
                  <li>• Engineering problem solving</li>
                  <li>• Documentation and iteration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-2 text-robotics-blue print:text-sm">Life Skills</h3>
                <ul className="text-sm space-y-1 print:text-xs print:space-y-0">
                  <li>• Teamwork and collaboration</li>
                  <li>• Critical thinking</li>
                  <li>• Presentation skills</li>
                  <li>• Resilience and persistence</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 print:p-4">
            <h2 className="font-display font-bold text-xl mb-4 text-robotics-navy print:text-lg">
              Registration & Contact
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:gap-2">
              <div>
                <p className="font-bold mb-2 print:text-sm">Program Details</p>
                <p className="text-sm mb-1 print:text-xs">📅 August 15, 2025 – May 15, 2026</p>
                <p className="text-sm mb-1 print:text-xs">💰 $100 per month</p>
                <p className="text-sm mb-1 print:text-xs">👥 Max 6 students per class</p>
                <p className="text-sm print:text-xs">⏰ Weekly sessions available</p>
              </div>
              <div>
                <p className="font-bold mb-2 print:text-sm">Contact Information</p>
                <p className="text-sm mb-1 print:text-xs">📞 Megha Billore: 603-866-0275</p>
                <p className="text-sm mb-1 print:text-xs">📍 683 Carryduff St NW, Concord - 28027</p>
                <p className="text-sm print:text-xs">🌐 https://bot-venture.com</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-robotics-navy text-white p-4 text-center print:p-2">
            <p className="text-sm print:text-xs">© 2025 Bot Venture - VEX Certified Robotics Education</p>
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style>
        {`
          @media print {
            @page {
              size: letter portrait;
              margin: 0.5in;
            }
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .print\\:hidden {
              display: none !important;
            }
            .print\\:text-xs {
              font-size: 0.7rem !important;
            }
            .print\\:text-sm {
              font-size: 0.8rem !important;
            }
            .print\\:space-y-0 > * + * {
              margin-top: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CurriculumFlyer;
