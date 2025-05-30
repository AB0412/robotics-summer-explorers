
import React from 'react';

const CurriculumSection = () => {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            Regular Program Curriculum
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our comprehensive month-by-month curriculum designed to build robotics skills progressively
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <h4 className="font-bold text-2xl text-center text-robotics-navy mb-6">📘 Curriculum Plan by Month</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 August (3 Weeks)</h5>
                <p className="font-medium mb-2">Getting Started with VEX EXP</p>
                <ul className="text-sm space-y-1">
                  <li>• Introduction to Robotics & VEX EXP kits</li>
                  <li>• Basic building concepts</li>
                  <li>• Introduction to VEXcode</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 September</h5>
                <p className="font-medium mb-2">Mechanics & Drive Systems</p>
                <ul className="text-sm space-y-1">
                  <li>• Gears, pulleys, and motion</li>
                  <li>• Building drive systems</li>
                  <li>• Programming drive control</li>
                  <li>• Mini challenge – Navigation</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 October</h5>
                <p className="font-medium mb-2">Sensors & Smart Programming</p>
                <ul className="text-sm space-y-1">
                  <li>• Introduction to sensors</li>
                  <li>• Sensor integration in code</li>
                  <li>• Looping & conditional logic</li>
                  <li>• Autonomous obstacle navigation</li>
                </ul>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 November</h5>
                <p className="font-medium mb-2">Team Collaboration</p>
                <ul className="text-sm space-y-1">
                  <li>• Team formation and roles</li>
                  <li>• Design process & sketching</li>
                  <li>• Building arm/lift mechanisms</li>
                  <li>• Iterating designs</li>
                </ul>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 December</h5>
                <p className="font-medium mb-2">Strategy & Mini Challenges</p>
                <ul className="text-sm space-y-1">
                  <li>• Game-based strategy</li>
                  <li>• Autonomous + driver control</li>
                  <li>• Winter Break: Dec 15 - Jan 5</li>
                </ul>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 January</h5>
                <p className="font-medium mb-2">Full Robot Build Phase</p>
                <ul className="text-sm space-y-1">
                  <li>• Design final robot</li>
                  <li>• Building & programming</li>
                  <li>• Testing & refinement</li>
                </ul>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 February</h5>
                <p className="font-medium mb-2">Advanced Coding</p>
                <ul className="text-sm space-y-1">
                  <li>• Variables & functions</li>
                  <li>• Tuning autonomous routines</li>
                  <li>• Practice matches</li>
                </ul>
              </div>

              <div className="bg-teal-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 March</h5>
                <p className="font-medium mb-2">Mock Competition Prep</p>
                <ul className="text-sm space-y-1">
                  <li>• Strategy refinement</li>
                  <li>• Judging rubric review</li>
                  <li>• Internal mock tournament</li>
                </ul>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 April</h5>
                <p className="font-medium mb-2">Engineering Notebook</p>
                <ul className="text-sm space-y-1">
                  <li>• Documentation skills</li>
                  <li>• Design improvements</li>
                  <li>• Presentation development</li>
                </ul>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg md:col-span-2 lg:col-span-1">
                <h5 className="font-bold text-robotics-navy mb-2">🔹 May</h5>
                <p className="font-medium mb-2">Final Project Showcase</p>
                <ul className="text-sm space-y-1">
                  <li>• Final testing & polish</li>
                  <li>• Showcase event for families</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
