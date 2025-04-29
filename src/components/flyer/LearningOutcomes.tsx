
import React from 'react';
import { Bot, Lightbulb, Cog, Wrench } from 'lucide-react';

const LearningOutcomes: React.FC = () => {
  return (
    <div className="mb-6 print:mb-4">
      <h2 className="font-display font-bold text-2xl mb-3 text-robotics-navy border-b border-robotics-accent pb-2 print:text-xl print:mb-2">
        What Students Will Learn
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print:gap-2">
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-6 print:w-6">
            <Bot size={16} />
          </div>
          <div>
            <p className="font-medium print:text-sm">VEX Robotics</p>
            <p className="text-gray-600 print:text-xs">Build robots with VEX kits and learn programming</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-6 print:w-6">
            <Lightbulb size={16} />
          </div>
          <div>
            <p className="font-medium print:text-sm">Problem Solving</p>
            <p className="text-gray-600 print:text-xs">Develop critical thinking through challenges</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-6 print:w-6">
            <Cog size={16} />
          </div>
          <div>
            <p className="font-medium print:text-sm">Coding Basics</p>
            <p className="text-gray-600 print:text-xs">Learn programming fundamentals through robotics</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="h-7 w-7 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-6 print:w-6">
            <Wrench size={16} />
          </div>
          <div>
            <p className="font-medium print:text-sm">Teamwork</p>
            <p className="text-gray-600 print:text-xs">Collaborate on projects and presentations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcomes;
