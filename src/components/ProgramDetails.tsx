import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Calendar, DollarSign } from 'lucide-react';

const ProgramDetails = () => {
  return (
    <section id="program" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            Program Details
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive 12-week summer robotics program offers a blend of education and fun for elementary students.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                <Calendar />
              </div>
              <h3 className="font-display font-bold text-xl">Program Duration</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>12-week summer program</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>3 months total duration</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Weekly sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Available in afternoon & evening hours</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                <Clock />
              </div>
              <h3 className="font-display font-bold text-xl">Class Format</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>1.5 hours per class</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>One class per week</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Small group settings (max 8 students)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Hands-on learning experiences</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                <DollarSign />
              </div>
              <h3 className="font-display font-bold text-xl">Program Cost</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>$200 per month</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>$600 total for full program</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Materials and equipment included</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Limited spots available</span>
              </li>
            </ul>
          </div>
        </div>
        
        <Tabs defaultValue="curriculum" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="skills">Skills Learned</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curriculum" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>12-Week Curriculum</CardTitle>
                <CardDescription>What students will learn throughout the program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg">Weeks 1-4: Introduction to Robotics</h4>
                    <p className="text-sm text-gray-600">
                      Students learn the basics of robotics, including robot components, simple machines, 
                      and basic building techniques using VEX platform.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg">Weeks 5-8: Basic Programming</h4>
                    <p className="text-sm text-gray-600">
                      Introduction to programming concepts with visual programming languages. Students will 
                      learn to control motors, use sensors, and create simple programs for their robots.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg">Weeks 9-12: Engineering Challenges & Final Projects</h4>
                    <p className="text-sm text-gray-600">
                      Students apply their knowledge to solve engineering challenges and work on a final project 
                      to showcase their learning. The program concludes with a presentation event.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="skills" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills Developed</CardTitle>
                <CardDescription>What students will gain from the program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Critical thinking and problem-solving</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Basic programming concepts</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Engineering design principles</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Teamwork and collaboration</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Creative thinking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Technical vocabulary</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Patience and persistence</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Public speaking (for final presentations)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProgramDetails;
