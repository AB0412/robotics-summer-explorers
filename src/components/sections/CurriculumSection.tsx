
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
            Our comprehensive curriculum designed to build robotics skills progressively
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="text-center">
              <h4 className="font-bold text-2xl text-robotics-navy mb-6">Program Overview</h4>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our 9-month robotics program runs from August 2025 to May 2026, providing students with hands-on experience in VEX robotics. Students will learn fundamental engineering concepts, programming skills, and teamwork through structured activities and challenges.
              </p>
            </div>

            {/* Curriculum Plan by Month */}
            <div className="mt-12">
              <h3 className="font-bold text-2xl text-robotics-navy mb-8 text-center">
                Curriculum Plan by Month
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* August */}
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-robotics-blue">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">August (3 Weeks)</h4>
                  <h5 className="font-semibold text-robotics-blue mb-2">Getting Started with VEX</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Introduction to Robotics</li>
                    <li>• VEX EXP kit basics</li>
                    <li>• Introduction to VEXcode</li>
                  </ul>
                </div>

                {/* September */}
                <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">September</h4>
                  <h5 className="font-semibold text-green-600 mb-2">Mechanics & Drive Systems</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Gears, pulleys, and motion</li>
                    <li>• Building drive systems</li>
                    <li>• Programming drive control</li>
                    <li>• Mini challenge – Navigation</li>
                  </ul>
                </div>

                {/* October */}
                <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">October</h4>
                  <h5 className="font-semibold text-yellow-600 mb-2">Sensors & Smart Programming</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Introduction to sensors</li>
                    <li>• Sensor integration in code</li>
                    <li>• Looping & conditional logic</li>
                    <li>• Autonomous navigation</li>
                  </ul>
                </div>

                {/* November */}
                <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">November</h4>
                  <h5 className="font-semibold text-purple-600 mb-2">Team Collaboration</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Team formation and roles</li>
                    <li>• Design process & sketching</li>
                    <li>• Building arm/lift mechanisms</li>
                    <li>• Iterating designs</li>
                  </ul>
                </div>

                {/* December */}
                <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">December</h4>
                  <h5 className="font-semibold text-red-600 mb-2">Strategy & Mini Challenges</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Game-based strategy</li>
                    <li>• Autonomous + driver control</li>
                    <li>• Winter Break: Dec 15 - Jan 5</li>
                  </ul>
                </div>

                {/* January */}
                <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">January</h4>
                  <h5 className="font-semibold text-indigo-600 mb-2">Full Robot Build Phase</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Design final robot</li>
                    <li>• Building & programming</li>
                    <li>• Testing & refinement</li>
                  </ul>
                </div>

                {/* February */}
                <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">February</h4>
                  <h5 className="font-semibold text-pink-600 mb-2">Advanced Coding</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Variables & functions</li>
                    <li>• Tuning autonomous routines</li>
                    <li>• Practice matches</li>
                  </ul>
                </div>

                {/* March */}
                <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">March</h4>
                  <h5 className="font-semibold text-teal-600 mb-2">Mock Competition Prep</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Strategy refinement</li>
                    <li>• Judging rubric review</li>
                    <li>• Internal mock tournament</li>
                  </ul>
                </div>

                {/* April */}
                <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">April</h4>
                  <h5 className="font-semibold text-orange-600 mb-2">Engineering Notebook</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Documentation skills</li>
                    <li>• Design improvements</li>
                    <li>• Presentation development</li>
                  </ul>
                </div>

                {/* May */}
                <div className="bg-gray-100 p-6 rounded-lg border-l-4 border-gray-500">
                  <h4 className="font-bold text-xl text-robotics-navy mb-3">May</h4>
                  <h5 className="font-semibold text-gray-600 mb-2">Final Project Showcase</h5>
                  <ul className="space-y-1 text-gray-700">
                    <li>• Final testing & polish</li>
                    <li>• Showcase event for families</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
