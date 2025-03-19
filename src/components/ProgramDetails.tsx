import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Calendar, DollarSign, Book, BookOpen, Clock3 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ProgramDetails = () => {
  return (
    <section id="program" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            Program Details
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our comprehensive 8-week summer robotics program offers a blend of education and fun for elementary students.
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
                <span>8-week summer program</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>2 months total duration</span>
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
                <span>$100 per month</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>$200 total for full program</span>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="curriculum">Curriculum Overview</TabsTrigger>
            <TabsTrigger value="skills">Skills Learned</TabsTrigger>
            <TabsTrigger value="detailed-curriculum">Weekly Curriculum</TabsTrigger>
          </TabsList>
          
          <TabsContent value="curriculum" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>8-Week Curriculum</CardTitle>
                <CardDescription>What students will learn throughout the program</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg">Weeks 1-3: Introduction to Robotics</h4>
                    <p className="text-sm text-gray-600">
                      Students learn the basics of robotics, including robot components, simple machines, 
                      and basic building techniques using VEX platform.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg">Weeks 4-6: Basic Programming</h4>
                    <p className="text-sm text-gray-600">
                      Introduction to programming concepts with visual programming languages. Students will 
                      learn to control motors, use sensors, and create simple programs for their robots.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg">Weeks 7-8: Engineering Challenges & Final Projects</h4>
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
          
          <TabsContent value="detailed-curriculum" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-robotics-blue" />
                  <span>Detailed Weekly Curriculum</span>
                </CardTitle>
                <CardDescription>Comprehensive breakdown of activities for each week</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto pr-2">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="week1">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">1</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Introduction to Robotics and VEX IQ</h3>
                          <p className="text-sm text-gray-600">Introduce students to robotics, VEX IQ kits, and basic components.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: What is Robotics? (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Discuss what robots are and how they are used in the real world.</li>
                            <li>Show examples of simple robots.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Explore the VEX IQ Kit (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Introduce the VEX IQ kit and its components (motors, sensors, brain, etc.).</li>
                            <li>Let students assemble a simple base robot (e.g., a wheeled chassis).</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: First Drive (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Teach students how to use the controller to drive the robot.</li>
                            <li>Set up a simple driving challenge (e.g., navigate through a maze).</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week2">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">2</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Building and Engineering Basics</h3>
                          <p className="text-sm text-gray-600">Teach basic engineering principles and build a functional robot.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: Engineering Basics (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Discuss simple machines (levers, wheels, pulleys) and how they are used in robotics.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Build a Robot Arm (45 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Guide students to build a robot arm attachment for their base robot.</li>
                            <li>Explain how gears and motors work together.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: Test the Arm (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Have students use the arm to pick up and move objects.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week3">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">3</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Introduction to Coding with VEXcode IQ</h3>
                          <p className="text-sm text-gray-600">Introduce students to block-based coding using VEXcode IQ.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: What is Coding? (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Explain what coding is and how it controls robots.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Explore VEXcode IQ (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Introduce the VEXcode IQ interface.</li>
                            <li>Teach students how to connect the robot to the software.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: First Program (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Guide students to write a simple program to move the robot forward and backward.</li>
                            <li>Add a command to make the robot arm move.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">4</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Sensors and Automation</h3>
                          <p className="text-sm text-gray-600">Introduce sensors and how they make robots "smart."</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: What are Sensors? (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Explain how sensors (e.g., touch, color, distance) work.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Build and Test a Sensor (45 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Add a sensor to the robot (e.g., a distance sensor).</li>
                            <li>Write a program to make the robot stop when it detects an obstacle.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: Challenge (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Set up a challenge where the robot must navigate a course using the sensor.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week5">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">5</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Team Challenges</h3>
                          <p className="text-sm text-gray-600">Encourage teamwork and problem-solving through group challenges.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: Team Building (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Divide students into teams and assign roles (builder, coder, driver).</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Build a Team Robot (45 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Each team designs and builds a robot for a specific task (e.g., picking up objects).</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: Team Challenge (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Teams compete in a challenge (e.g., move objects from one area to another).</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week6">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">6</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Advanced Coding Concepts</h3>
                          <p className="text-sm text-gray-600">Introduce loops, conditionals, and more advanced coding concepts.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: Loops and Loops (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Explain loops and how they make coding more efficient.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Write a Program with Loops (45 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Guide students to write a program that makes the robot move in a square using loops.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: Add a Conditional (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Teach students to use a conditional (e.g., "if the sensor detects an obstacle, stop the robot").</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week7">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">7</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Design Your Own Robot</h3>
                          <p className="text-sm text-gray-600">Encourage creativity and independent problem-solving.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: Brainstorming (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Discuss different types of robots and their functions.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Design and Build (60 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Students design and build their own robot using the VEX IQ kit.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: Present Your Robot (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Each student or team presents their robot and explains its function.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="week8">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-robotics-lightblue/20 flex items-center justify-center text-robotics-blue">
                          <span className="font-bold">8</span>
                        </div>
                        <div className="text-left">
                          <h3 className="font-bold text-lg">Final Challenge and Celebration</h3>
                          <p className="text-sm text-gray-600">Showcase what students have learned and celebrate their achievements.</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-11">
                      <div className="space-y-4 text-sm">
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 1: Final Challenge Setup (15 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Set up a final challenge course (e.g., navigate a maze, pick up objects, and return to the start).</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4 pb-2">
                          <h4 className="font-bold mb-1">Activity 2: Compete in the Challenge (45 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Students use their robots to complete the challenge.</li>
                          </ul>
                        </div>
                        
                        <div className="border-l-2 border-robotics-blue pl-4">
                          <h4 className="font-bold mb-1">Activity 3: Awards and Celebration (30 mins)</h4>
                          <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                            <li>Hand out certificates or small prizes for participation and achievements.</li>
                            <li>Celebrate with snacks and a group photo.</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ProgramDetails;
