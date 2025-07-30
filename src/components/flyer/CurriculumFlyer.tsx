
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
                🛠️ VEX Robotics Year-Round Curriculum
              </h1>
              <p className="text-base print:text-sm">
                From Beginner to Advanced – Hands-on Engineering, Coding & Competition Skills
              </p>
              <div className="text-robotics-accent text-xs mt-1">
                https://bot-venture.com/curriculum
              </div>
            </div>
          </div>

          {/* Key Features - Compact */}
          <div className="p-3 print:p-2 bg-gray-50">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white p-2 rounded border-2 border-green-500 print:p-1">
                <p className="font-bold text-green-600 text-sm print:text-xs">✓ Flexible Entry</p>
                <p className="text-xs print:text-xs">Join anytime</p>
              </div>
              <div className="bg-white p-2 rounded border-2 border-robotics-blue print:p-1">
                <p className="font-bold text-robotics-blue text-sm print:text-xs">📈 Continuous Learning</p>
                <p className="text-xs print:text-xs">Progressive skills</p>
              </div>
            </div>
          </div>

          {/* Curriculum Topics - Compact Layout */}
          <div className="p-3 print:p-2">
            <h2 className="font-display font-bold text-lg mb-2 text-robotics-navy print:text-base print:mb-1">
              Learning Topics (Students Join Anytime)
            </h2>
            
            <div className="grid grid-cols-2 gap-2 print:gap-1">
              {/* Robotics Foundations */}
              <div className="bg-blue-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🏁 Robotics Foundations</h3>
                <p className="text-xs print:text-xs">Core robotics concepts, real-world applications</p>
              </div>

              {/* VEX Robotics Kit */}
              <div className="bg-green-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🔩 Mastering VEX Robotics Kit</h3>
                <p className="text-xs print:text-xs">Motors, sensors, components, connections</p>
              </div>

              {/* VEXcode Programming */}
              <div className="bg-yellow-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">💻 VEXcode Programming</h3>
                <p className="text-xs print:text-xs">Block & text coding, logic, loops</p>
              </div>

              {/* Mechanical Systems */}
              <div className="bg-purple-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">⚙️ Mechanical Systems</h3>
                <p className="text-xs print:text-xs">Gears, pulleys, drive engineering</p>
              </div>

              {/* Drive Systems */}
              <div className="bg-red-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🚗 Robust Drive Systems</h3>
                <p className="text-xs print:text-xs">Stable bases, wheel configurations</p>
              </div>

              {/* Driver Control */}
              <div className="bg-indigo-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🎮 Precision Control</h3>
                <p className="text-xs print:text-xs">Tank drive, arcade control, tuning</p>
              </div>

              {/* Autonomous Challenges */}
              <div className="bg-pink-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🧭 Autonomous Movement</h3>
                <p className="text-xs print:text-xs">Navigation, obstacle avoidance</p>
              </div>

              {/* Advanced Sensors */}
              <div className="bg-teal-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">📡 Advanced Sensors</h3>
                <p className="text-xs print:text-xs">Bumper, optical, distance, gyro</p>
              </div>

              {/* Efficient Logic */}
              <div className="bg-orange-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🔁 Efficient Logic</h3>
                <p className="text-xs print:text-xs">Functions, branches, optimization</p>
              </div>

              {/* Team Engineering */}
              <div className="bg-cyan-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🤝 Team Engineering</h3>
                <p className="text-xs print:text-xs">Collaboration, leadership, roles</p>
              </div>

              {/* Design Thinking */}
              <div className="bg-emerald-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">📐 Design Thinking</h3>
                <p className="text-xs print:text-xs">Sketching, CAD-style planning</p>
              </div>

              {/* Mechanism Engineering */}
              <div className="bg-violet-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🤖 Arm & Lift Engineering</h3>
                <p className="text-xs print:text-xs">Claws, torque, structural support</p>
              </div>

              {/* Strategy & Game Play */}
              <div className="bg-rose-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🎯 Strategy Engineering</h3>
                <p className="text-xs print:text-xs">Game rules, scoring optimization</p>
              </div>

              {/* Full Robot Build */}
              <div className="bg-amber-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🛠️ Full Robot Build</h3>
                <p className="text-xs print:text-xs">Competition-ready machines</p>
              </div>

              {/* Advanced Programming */}
              <div className="bg-lime-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🧠 Advanced Programming</h3>
                <p className="text-xs print:text-xs">Variables, autonomous tuning</p>
              </div>

              {/* Competition Simulation */}
              <div className="bg-sky-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🏆 Competition Practice</h3>
                <p className="text-xs print:text-xs">Match simulation, strategy refinement</p>
              </div>

              {/* Engineering Notebook */}
              <div className="bg-slate-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🧾 Documentation</h3>
                <p className="text-xs print:text-xs">Engineering notebook skills</p>
              </div>

              {/* Presentation Skills */}
              <div className="bg-zinc-50 p-2 rounded border print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🎤 Presentation Skills</h3>
                <p className="text-xs print:text-xs">Judging prep, public speaking</p>
              </div>

              {/* Final Showcase */}
              <div className="bg-gradient-to-br from-robotics-blue/20 to-robotics-accent/20 p-2 rounded border-2 border-robotics-accent print:p-1">
                <h3 className="font-bold text-robotics-navy mb-1 text-sm print:text-xs">🎉 Final Showcase</h3>
                <p className="text-xs print:text-xs">Demo presentations, celebration</p>
              </div>
            </div>
          </div>

          {/* Learning Outcomes - Compact */}
          <div className="p-3 print:p-2 bg-gray-50">
            <h2 className="font-display font-bold text-lg mb-2 text-robotics-navy print:text-base print:mb-1">
              Student Outcomes
            </h2>
            <div className="grid grid-cols-2 gap-3 print:gap-2">
              <div>
                <h3 className="font-bold mb-1 text-robotics-blue text-sm print:text-xs">Technical Skills</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Advanced robot building & design</li>
                  <li>• Competition-level programming</li>
                  <li>• Engineering problem solving</li>
                  <li>• Strategic thinking & optimization</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-1 text-robotics-blue text-sm print:text-xs">Life Skills</h3>
                <ul className="text-xs space-y-0 print:text-xs">
                  <li>• Leadership & teamwork</li>
                  <li>• Critical thinking & analysis</li>
                  <li>• Professional presentation</li>
                  <li>• Resilience & iteration</li>
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
                <p className="font-bold mb-1 text-sm print:text-xs">Program Flexibility</p>
                <p className="text-xs mb-0">✓ Join anytime during the year</p>
                <p className="text-xs mb-0">✓ Skill-level based placement</p>
                <p className="text-xs mb-0">✓ Beginner to advanced tracks</p>
                <p className="text-xs">✓ Continuous learning progression</p>
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
