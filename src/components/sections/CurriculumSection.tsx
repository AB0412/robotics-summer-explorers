
import React from 'react';

const CurriculumSection = () => {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            🛠️ VEX Robotics Year-Round Curriculum
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            <strong>From Beginner to Advanced – Hands-on Engineering, Coding & Competition Skills</strong>
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Robotics Foundations */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-robotics-blue">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🏁 Robotics Foundations</h4>
              <p className="text-gray-700">
                Explore core robotics concepts used in real-world applications. Understand how mechanical systems, electronics, and coding come together to create intelligent machines.
              </p>
            </div>

            {/* Mastering the VEX EXP Kit */}
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🔩 Mastering the VEX EXP Kit</h4>
              <p className="text-gray-700">
                Gain hands-on experience with the VEX EXP system—motors, sensors, metal components, and the control brain. Learn to safely build and connect your robot's physical systems.
              </p>
            </div>

            {/* VEXcode Programming */}
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">💻 VEXcode Programming – Beginner to Intermediate</h4>
              <p className="text-gray-700">
                Start with block-based or text-based programming in VEXcode. Progress from basic commands to logic, loops, and sensor control as you master robot behavior.
              </p>
            </div>

            {/* Mechanical Systems & Drive Engineering */}
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">⚙️ Mechanical Systems & Drive Engineering</h4>
              <p className="text-gray-700">
                Dive into gear ratios, pulleys, wheels, and drive train designs. Apply mechanical principles to create robots that balance speed, power, and control.
              </p>
            </div>

            {/* Building Robust Drive Systems */}
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🚗 Building Robust Drive Systems</h4>
              <p className="text-gray-700">
                Design and construct strong and accurate drive bases using various wheel configurations. Focus on stability, symmetry, and modular design for upgrades.
              </p>
            </div>

            {/* Precision Driver Control Coding */}
            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎮 Precision Driver Control Coding</h4>
              <p className="text-gray-700">
                Program the robot to respond to controller input with accuracy. Practice techniques like tank drive, arcade control, and speed tuning.
              </p>
            </div>

            {/* Autonomous Movement Challenges */}
            <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🧭 Autonomous Movement Challenges</h4>
              <p className="text-gray-700">
                Use sensors and smart logic to navigate courses without human input. Tackle obstacle avoidance, maze solving, and target-seeking tasks.
              </p>
            </div>

            {/* Advanced Sensor Integration */}
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">📡 Advanced Sensor Integration</h4>
              <p className="text-gray-700">
                Integrate bumper, optical, distance, and gyro sensors into your code. Build robots that adapt to environments and execute conditional behaviors.
              </p>
            </div>

            {/* Efficient Logic */}
            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🔁 Efficient Logic: Loops, Branches & Functions</h4>
              <p className="text-gray-700">
                Move beyond manual coding with modular, reusable functions and optimized logic. Learn how to break complex behavior into manageable code blocks.
              </p>
            </div>

            {/* Team Engineering & Leadership */}
            <div className="bg-cyan-50 p-6 rounded-lg border-l-4 border-cyan-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🤝 Team Engineering & Leadership</h4>
              <p className="text-gray-700">
                Work in engineering teams with rotating roles—builder, coder, documenter, and tester. Practice collaboration, leadership, and iterative problem-solving.
              </p>
            </div>

            {/* Design Thinking & Robot Planning */}
            <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">📐 Design Thinking & Robot Planning</h4>
              <p className="text-gray-700">
                Develop sketches, models, and CAD-style designs for complex builds. Learn to design with purpose—planning arms, lifts, and multi-functional attachments.
              </p>
            </div>

            {/* Arm, Claw & Lift Mechanism Engineering */}
            <div className="bg-violet-50 p-6 rounded-lg border-l-4 border-violet-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🤖 Arm, Claw & Lift Mechanism Engineering</h4>
              <p className="text-gray-700">
                Engineer mechanical subsystems that can grab, lift, and manipulate game elements. Understand torque, structural support, and gearing for strength.
              </p>
            </div>

            {/* Strategy & Game Play Engineering */}
            <div className="bg-rose-50 p-6 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎯 Strategy & Game Play Engineering</h4>
              <p className="text-gray-700">
                Study game rules, scoring zones, and field layouts to design robots that dominate both autonomous and driver-controlled periods.
              </p>
            </div>

            {/* Full Robot Build & Iteration */}
            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🛠️ Full Robot Build & Iteration</h4>
              <p className="text-gray-700">
                Plan, construct, and refine a competition-ready robot. Integrate structure, wiring, code, and sensors into a cohesive high-performance machine.
              </p>
            </div>

            {/* Advanced Programming & Autonomous Tuning */}
            <div className="bg-lime-50 p-6 rounded-lg border-l-4 border-lime-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🧠 Advanced Programming & Autonomous Tuning</h4>
              <p className="text-gray-700">
                Learn to tune motors, create timed sequences, and use variables for decision-making. Build a robot that operates flawlessly in autonomous mode.
              </p>
            </div>

            {/* Competition Simulation & Match Practice */}
            <div className="bg-sky-50 p-6 rounded-lg border-l-4 border-sky-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🏆 Competition Simulation & Match Practice</h4>
              <p className="text-gray-700">
                Run practice matches and refine competitive strategy. Evaluate robot performance under timed and judged conditions.
              </p>
            </div>

            {/* Engineering Notebook & Documentation */}
            <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🧾 Engineering Notebook & Documentation</h4>
              <p className="text-gray-700">
                Document your full design process, iterations, testing data, and team roles. Prepare for judged events and develop real-world engineering habits.
              </p>
            </div>

            {/* Presentation Skills & Judging Prep */}
            <div className="bg-zinc-50 p-6 rounded-lg border-l-4 border-zinc-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎤 Presentation Skills & Judging Prep</h4>
              <p className="text-gray-700">
                Learn how to present your design process and team work to a panel. Build confidence in explaining technical work to both experts and beginners.
              </p>
            </div>

            {/* Final Showcase & Demo Presentations */}
            <div className="bg-gradient-to-br from-robotics-blue/10 to-robotics-accent/10 p-6 rounded-lg border-l-4 border-robotics-accent">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎉 Final Showcase & Demo Presentations</h4>
              <p className="text-gray-700">
                Showcase your finished robots and projects at a public event for families and school leaders. Demonstrate advanced robotics knowledge and teamwork.
              </p>
            </div>

          </div>

          {/* Key Features */}
          <div className="bg-gradient-to-r from-robotics-blue/5 to-robotics-accent/5 rounded-lg p-8 border border-robotics-blue/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
                <div>
                  <h5 className="font-semibold text-robotics-navy mb-1">Flexible Entry</h5>
                  <p className="text-gray-700 text-sm">
                    Students can begin at any time and will be placed in challenges that match their skill level—from beginner to advanced.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-robotics-blue rounded-full flex items-center justify-center mt-1">
                  <span className="text-white font-bold text-sm">📈</span>
                </div>
                <div>
                  <h5 className="font-semibold text-robotics-navy mb-1">Continuous Learning</h5>
                  <p className="text-gray-700 text-sm">
                    Topics are revisited at deeper levels, so long-term students grow from basic to competitive-ready robotics engineers.
                  </p>
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
