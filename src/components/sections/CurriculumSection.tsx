
import React from 'react';

const CurriculumSection = () => {
  return (
    <section id="curriculum" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            VEX Robotics Year-Round Curriculum
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Topic-based structure that allows students to <strong>jump in at any point</strong>, 
            while ensuring they get exposed to the full cycle of robotics design, programming, testing, and presentation.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Introduction to Robotics */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-robotics-blue">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🧠 Introduction to Robotics</h4>
              <p className="text-gray-700">
                Learn what robotics is, why it's important, and how it applies to the real world. Great for first-time learners to get excited about technology and engineering.
              </p>
            </div>

            {/* Getting Started with VEX */}
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🔧 Getting Started with VEX</h4>
              <p className="text-gray-700">
                Explore the VEX robotics kit components—motors, sensors, brain, and structural parts. Understand how to connect and power the robot.
              </p>
            </div>

            {/* Introduction to VEXcode */}
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">💻 Introduction to VEXcode</h4>
              <p className="text-gray-700">
                Begin programming your robot using VEXcode Blocks or Text. Learn how to write basic code to control motors and movements.
              </p>
            </div>

            {/* Gears, Pulleys & Motion */}
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">⚙️ Gears, Pulleys & Motion</h4>
              <p className="text-gray-700">
                Understand mechanical systems. Learn how gears and pulleys affect speed and torque in robot movement.
              </p>
            </div>

            {/* Building Drive Systems */}
            <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🚗 Building Drive Systems</h4>
              <p className="text-gray-700">
                Design and build a stable robot base that can move in multiple directions. Explore different drive configurations.
              </p>
            </div>

            {/* Programming Drive Control */}
            <div className="bg-indigo-50 p-6 rounded-lg border-l-4 border-indigo-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎮 Programming Drive Control</h4>
              <p className="text-gray-700">
                Write code to control your robot using a controller. Learn about forward, reverse, turning, and speed adjustments.
              </p>
            </div>

            {/* Mini Navigation Challenge */}
            <div className="bg-pink-50 p-6 rounded-lg border-l-4 border-pink-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🗺️ Mini Navigation Challenge</h4>
              <p className="text-gray-700">
                Test your driving and coding skills in a guided mini maze or path-following challenge.
              </p>
            </div>

            {/* Introduction to Sensors */}
            <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">📡 Introduction to Sensors</h4>
              <p className="text-gray-700">
                Discover how robots use sensors to "see" and "react" to their environment. Learn about bumper switches, distance sensors, and more.
              </p>
            </div>

            {/* Sensor-Based Programming */}
            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🔄 Sensor-Based Programming</h4>
              <p className="text-gray-700">
                Use logic and conditions to create autonomous robot behavior based on sensor input.
              </p>
            </div>

            {/* Loops & Conditional Logic */}
            <div className="bg-cyan-50 p-6 rounded-lg border-l-4 border-cyan-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🔁 Loops & Conditional Logic</h4>
              <p className="text-gray-700">
                Master repeating actions and decision-making in code. Essential for efficient autonomous routines.
              </p>
            </div>

            {/* Team Collaboration & Roles */}
            <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🤝 Team Collaboration & Roles</h4>
              <p className="text-gray-700">
                Form teams and explore engineering roles: builder, programmer, designer, and driver. Practice communication and planning.
              </p>
            </div>

            {/* Design Process & Sketching */}
            <div className="bg-violet-50 p-6 rounded-lg border-l-4 border-violet-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">✏️ Design Process & Sketching</h4>
              <p className="text-gray-700">
                Learn how to brainstorm, sketch, and plan a robot before building. Apply design thinking and creativity.
              </p>
            </div>

            {/* Building Arm & Lift Mechanisms */}
            <div className="bg-rose-50 p-6 rounded-lg border-l-4 border-rose-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">💪 Building Arm & Lift Mechanisms</h4>
              <p className="text-gray-700">
                Build functional mechanisms like claws, arms, or lifts. Explore torque and leverage.
              </p>
            </div>

            {/* Game-Based Strategy */}
            <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎯 Game-Based Strategy</h4>
              <p className="text-gray-700">
                Understand robotics competitions and how to plan for both autonomous and driver-controlled play.
              </p>
            </div>

            {/* Complete Robot Build */}
            <div className="bg-lime-50 p-6 rounded-lg border-l-4 border-lime-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🛠️ Complete Robot Build</h4>
              <p className="text-gray-700">
                Design and build a fully functional robot that performs tasks in a challenge or game setup.
              </p>
            </div>

            {/* Advanced Coding Concepts */}
            <div className="bg-sky-50 p-6 rounded-lg border-l-4 border-sky-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🧠 Advanced Coding Concepts</h4>
              <p className="text-gray-700">
                Learn about functions, variables, and how to structure large programs. Tune your code for better precision.
              </p>
            </div>

            {/* Practice Matches */}
            <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-slate-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🏆 Practice Matches</h4>
              <p className="text-gray-700">
                Simulate match conditions and refine your robot's performance through repetition and feedback.
              </p>
            </div>

            {/* Engineering Notebook Skills */}
            <div className="bg-zinc-50 p-6 rounded-lg border-l-4 border-zinc-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🧾 Engineering Notebook Skills</h4>
              <p className="text-gray-700">
                Learn how to document your ideas, designs, and progress like a real engineer. Focus on clear, organized communication.
              </p>
            </div>

            {/* Presentation & Judging Prep */}
            <div className="bg-neutral-50 p-6 rounded-lg border-l-4 border-neutral-500">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎤 Presentation & Judging Prep</h4>
              <p className="text-gray-700">
                Practice presenting your robot and design process for a judging panel. Build public speaking and confidence.
              </p>
            </div>

            {/* Showcase & Demo Day */}
            <div className="bg-gradient-to-br from-robotics-blue/10 to-robotics-accent/10 p-6 rounded-lg border-l-4 border-robotics-accent">
              <h4 className="font-bold text-xl text-robotics-navy mb-3">🎉 Showcase & Demo Day</h4>
              <p className="text-gray-700">
                Host a final event where students demonstrate their work to families, friends, or school leaders. Celebrate learning and innovation!
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
