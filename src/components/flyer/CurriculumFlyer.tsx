
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
      <div className="max-w-a4 mx-auto">
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
          style={{ width: "210mm", minHeight: "297mm" }}
        >
          {/* Header */}
          <div className="relative bg-robotics-navy text-white p-3 print:p-2">
            <div className="text-center">
              <h1 className="font-display font-bold text-2xl mb-1 text-robotics-accent print:text-xl">
                VEX Robotics Program 2025-26
              </h1>
              <p className="text-base print:text-sm">
                9-Month Learning Journey for Young Engineers
              </p>
              <div className="text-robotics-accent text-xs mt-1">
                https://bot-venture.com/curriculum
              </div>
            </div>
          </div>

          {/* Program Overview - Compact */}
          <div className="p-3 print:p-2 bg-gray-50">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2 rounded border-2 border-robotics-lightblue print:p-1">
                <p className="font-bold text-robotics-blue text-sm print:text-xs">9 Months</p>
                <p className="text-xs print:text-xs">Aug 2025 - May 2026</p>
              </div>
              <div className="bg-white p-2 rounded border-2 border-robotics-lightblue print:p-1">
                <p className="font-bold text-robotics-blue text-sm print:text-xs">VEX Platform</p>
                <p className="text-xs print:text-xs">Professional</p>
              </div>
              <div className="bg-white p-2 rounded border-2 border-robotics-lightblue print:p-1">
                <p className="font-bold text-robotics-blue text-sm print:text-xs">Max 6 Students</p>
                <p className="text-xs print:text-xs">Per Class</p>
              </div>
              <div className="bg-white p-2 rounded border-2 border-robotics-lightblue print:p-1">
                <p className="font-bold text-robotics-blue text-sm print:text-xs">$100/Month</p>
                <p className="text-xs print:text-xs">Tuition</p>
              </div>
            </div>
          </div>

          {/* Curriculum Grid - Compact Layout */}
          <div className="p-3 print:p-2">
            <h2 className="font-display font-bold text-lg mb-2 text-robotics-navy print:text-base print:mb-1">
              Monthly Curriculum
            </h2>
            
            <div className="grid grid-cols-2 gap-2 print:gap-1">
              {/* August */}
              <div className="bg-blue-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Aug (3 Weeks) - Getting Started</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Intro to Robotics & VEX EXP</li>
                  <li>• VEXcode basics</li>
                </ul>
              </div>

              {/* September */}
              <div className="bg-green-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Sep - Mechanics & Drive</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Gears, pulleys, motion</li>
                  <li>• Drive systems & programming</li>
                </ul>
              </div>

              {/* October */}
              <div className="bg-yellow-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Oct - Sensors & Programming</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Sensor integration</li>
                  <li>• Autonomous navigation</li>
                </ul>
              </div>

              {/* November */}
              <div className="bg-purple-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Nov - Team Collaboration</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Team roles & design process</li>
                  <li>• Building arm/lift mechanisms</li>
                </ul>
              </div>

              {/* December */}
              <div className="bg-red-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Dec - Strategy & Challenges</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Game strategy</li>
                  <li>• Winter Break: Dec 15 - Jan 5</li>
                </ul>
              </div>

              {/* January */}
              <div className="bg-indigo-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Jan - Full Robot Build</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Design & build final robot</li>
                  <li>• Testing & refinement</li>
                </ul>
              </div>

              {/* February */}
              <div className="bg-pink-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Feb - Advanced Coding</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Variables & functions</li>
                  <li>• Autonomous tuning</li>
                </ul>
              </div>

              {/* March */}
              <div className="bg-teal-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Mar - Competition Prep</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Strategy refinement</li>
                  <li>• Mock tournament</li>
                </ul>
              </div>

              {/* April */}
              <div className="bg-orange-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">Apr - Documentation</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Engineering notebook</li>
                  <li>• Presentation development</li>
                </ul>
              </div>

              {/* May */}
              <div className="bg-gray-100 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">May - Showcase</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Final project showcase</li>
                  <li>• Family presentation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Learning Outcomes - Compact */}
          <div className="p-3 print:p-2 bg-gray-50">
            <h2 className="font-display font-bold text-lg mb-2 text-robotics-navy print:text-base print:mb-1">
              Learning Outcomes
            </h2>
            <div className="grid grid-cols-2 gap-3 print:gap-2">
              <div>
                <h3 className="font-bold mb-1 text-robotics-blue text-sm print:text-xs">Technical Skills</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Robot building & design</li>
                  <li>• Programming fundamentals</li>
                  <li>• Engineering problem solving</li>
                  <li>• Documentation & iteration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-1 text-robotics-blue text-sm print:text-xs">Life Skills</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Teamwork & collaboration</li>
                  <li>• Critical thinking</li>
                  <li>• Presentation skills</li>
                  <li>• Resilience & persistence</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Information - Compact */}
          <div className="p-3 print:p-2">
            <h2 className="font-display font-bold text-lg mb-2 text-robotics-navy print:text-base print:mb-1">
              Registration & Contact
            </h2>
            <div className="grid grid-cols-2 gap-3 print:gap-2">
              <div>
                <p className="font-bold mb-1 text-sm print:text-xs">Program Details</p>
                <p className="text-xs mb-0">📅 August 15, 2025 – May 15, 2026</p>
                <p className="text-xs mb-0">💰 $100 per month</p>
                <p className="text-xs mb-0">👥 Max 6 students per class</p>
                <p className="text-xs">⏰ Weekly sessions available</p>
              </div>
              <div>
                <p className="font-bold mb-1 text-sm print:text-xs">Contact Information</p>
                <p className="text-xs mb-0">📞 Megha Billore: 603-866-0275</p>
                <p className="text-xs mb-0">📍 683 Carryduff St NW, Concord - 28027</p>
                <p className="text-xs">🌐 https://bot-venture.com</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-robotics-navy text-white p-2 text-center print:p-1">
            <p className="text-xs">© 2025 Bot Venture - VEX Certified Robotics Education</p>
          </div>
        </div>
      </div>
      
      {/* Print Styles for A4 */}
      <style>
        {`
          @media print {
            @page {
              size: A4 portrait;
              margin: 15mm;
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
              font-size: 0.65rem !important;
              line-height: 1.1 !important;
            }
            .print\\:text-sm {
              font-size: 0.75rem !important;
              line-height: 1.2 !important;
            }
            .print\\:text-base {
              font-size: 0.85rem !important;
              line-height: 1.3 !important;
            }
            .print\\:space-y-0 > * + * {
              margin-top: 0 !important;
            }
            .print\\:p-1 {
              padding: 0.25rem !important;
            }
            .print\\:p-2 {
              padding: 0.5rem !important;
            }
            .print\\:mb-1 {
              margin-bottom: 0.25rem !important;
            }
            .print\\:gap-1 {
              gap: 0.25rem !important;
            }
            .print\\:gap-2 {
              gap: 0.5rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CurriculumFlyer;
