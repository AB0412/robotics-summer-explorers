
import React from 'react';
import { Bot, Lightbulb, Cog, Wrench } from 'lucide-react';

const LearningOutcomes: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="font-display font-bold text-2xl mb-4 text-robotics-navy border-b border-robotics-accent pb-2">
        What Students Will Learn
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <p className="font-medium">VEX Robotics</p>
            <p className="text-gray-600">Build robots with VEX kits and learn programming</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
            <Lightbulb size={18} />
          </div>
          <div>
            <p className="font-medium">Problem Solving</p>
            <p className="text-gray-600">Develop critical thinking through challenges</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
            <Cog size={18} />
          </div>
          <div>
            <p className="font-medium">Coding Basics</p>
            <p className="text-gray-600">Learn programming fundamentals through robotics</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue shrink-0">
            <Wrench size={18} />
          </div>
          <div>
            <p className="font-medium">Teamwork</p>
            <p className="text-gray-600">Collaborate on projects and presentations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningOutcomes;
