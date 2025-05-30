
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurriculumSection;
