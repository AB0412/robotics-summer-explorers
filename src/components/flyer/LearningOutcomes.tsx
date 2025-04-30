
import React from 'react';
import { Bot, Lightbulb, Cog, Wrench } from 'lucide-react';

const LearningOutcomes: React.FC = () => {
  return (
    <div className="mb-4 print:mb-3">
      <h2 className="font-display font-bold text-xl mb-2 text-robotics-navy border-b border-robotics-accent pb-1 print:text-lg print:mb-2">
        What Students Will Learn
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print:gap-1">
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-5 print:w-5">
            <Bot size={14} />
          </div>
          <div>
            <p className="font-medium print:text-sm">VEX Robotics</p>
            <p className="text-gray-600 print:text-xs">Build robots with VEX kits</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-5 print:w-5">
            <Lightbulb size={14} />
          </div>
          <div>
            <p className="font-medium print:text-sm">Problem Solving</p>
            <p className="text-gray-600 print:text-xs">Develop critical thinking</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-5 print:w-5">
            <Cog size={14} />
          </div>
          <div>
            <p className="font-medium print:text-sm">Coding Basics</p>
            <p className="text-gray-600 print:text-xs">Learn programming fundamentals</p>
          </div>
        </div>
        
        <div className="flex items-start gap-2">
          <div className="h-6 w-6 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0 print:h-5 print:w-5">
            <Wrench size={14} />
          </div>
          <div>
            <p className="font-medium print:text-sm">Teamwork</p>
            <p className="text-gray-600 print:text-xs">Collaborate on projects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcomes;
