
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircuitBoard, Brain, Lightbulb, Users, Code, Trophy } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            About Our Robotics Program
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our robotics summer camp introduces elementary students to the exciting world of robotics through hands-on activities with VEX robotics platform.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<CircuitBoard />}
            title="VEX Robotics"
            description="Students work with VEX robotics kits to build robots and learn basic programming concepts."
          />
          <FeatureCard 
            icon={<Brain />}
            title="Computational Thinking"
            description="Students develop logical thinking and problem-solving skills through robotics challenges."
          />
          <FeatureCard 
            icon={<Lightbulb />}
            title="Creative Problem Solving"
            description="Students develop critical thinking skills through engaging challenges and projects."
          />
          <FeatureCard 
            icon={<Users />}
            title="Small Group Learning"
            description="Our small class sizes ensure personalized attention for each student."
          />
          <FeatureCard 
            icon={<Code />}
            title="Introduction to Coding"
            description="Learn basic programming concepts through fun, interactive robotics activities."
          />
          <FeatureCard 
            icon={<Trophy />}
            title="Project Showcase"
            description="Students present their projects at the end of the program to showcase their achievements."
          />
        </div>
        
        <div className="mt-16 bg-robotics-navy rounded-lg p-8 text-white text-center">
          <h3 className="font-display font-bold text-2xl mb-4">Designed for Elementary Students</h3>
          <p className="text-lg mb-6">Our program is specifically designed for children in grades 1-5, with age-appropriate activities and challenges.</p>
          <p className="text-robotics-accent font-bold text-xl">No prior experience necessary!</p>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <Card>
      <CardHeader>
        <div className="h-12 w-12 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl font-display">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
