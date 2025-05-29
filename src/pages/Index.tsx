
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Mail, MessageSquare, MapPin, Download, Bot, Cog, Zap, Users, Trophy, Lightbulb, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProgramDetails from '@/components/ProgramDetails';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section - Updated for Year-Round Classes */}
      <section className="relative bg-robotics-navy text-white py-20 overflow-hidden">
        <div className="absolute left-0 top-0 opacity-10">
          <Cog size={200} className="text-white animate-gear-spin" />
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <Cog size={150} className="text-white animate-gear-spin" style={{ animationDirection: 'reverse' }} />
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              <span className="text-robotics-accent">Year-Round</span> Robotics Classes
            </h1>
            
            <p className="text-xl md:text-2xl mb-8">
              Hands-on STEAM education through VEX robotics for students grades 1-5
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg mb-8">
              <h2 className="font-display font-bold text-2xl mb-6 text-robotics-accent">Our STEAM Approach: Learning That Connects the Dots</h2>
              <p className="text-lg leading-relaxed">
                In our robotics classes, we go beyond just building and coding—we bring the full power of STEAM (Science, Technology, Engineering, Arts, and Math) into every session. Students not only learn how robots move and think, but also why design matters, how to solve real-world problems creatively, and how teamwork and critical thinking turn ideas into action. It's hands-on learning that's fun, challenging, and built for the future.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Bot className="text-robotics-accent mb-4 mx-auto" size={48} />
                <h3 className="font-bold text-xl mb-2">VEX Robotics</h3>
                <p>Professional-grade robotics platform used in schools worldwide</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Users className="text-robotics-accent mb-4 mx-auto" size={48} />
                <h3 className="font-bold text-xl mb-2">Small Classes</h3>
                <p>Personalized attention with maximum 6 students per class</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <Trophy className="text-robotics-accent mb-4 mx-auto" size={48} />
                <h3 className="font-bold text-xl mb-2">Competition Ready</h3>
                <p>Prepare for VEX IQ competitions and robotics tournaments</p>
              </div>
            </div>
            
            <Link to="/registration">
              <Button size="lg" className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy font-bold text-lg px-8 py-4">
                <Zap className="mr-2" size={24} />
                Register for Classes Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Program Options with Tabs */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
              Choose Your Program
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We offer both year-round classes and intensive summer programs to fit your schedule and learning goals.
            </p>
          </div>
          
          <Tabs defaultValue="year-round" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="year-round" className="text-lg font-medium">Year-Round Classes</TabsTrigger>
              <TabsTrigger value="summer" className="text-lg font-medium">Summer Program</TabsTrigger>
            </TabsList>
            
            <TabsContent value="year-round" className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <Bot className="text-robotics-blue mx-auto mb-4" size={64} />
                      <h3 className="font-display font-bold text-3xl mb-4 text-robotics-navy">Year-Round Robotics Program</h3>
                      <p className="text-lg text-gray-600 mb-6">Comprehensive robotics education with structured curriculum</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center bg-gray-50 p-6 rounded-lg">
                        <Calendar className="text-robotics-blue mx-auto mb-2" size={32} />
                        <p className="font-bold text-robotics-accent text-xl">Aug 15 - May 15</p>
                        <p className="text-gray-600">Program Duration</p>
                      </div>
                      <div className="text-center bg-gray-50 p-6 rounded-lg">
                        <p className="font-bold text-robotics-accent text-xl">$100</p>
                        <p className="text-gray-600">Per Month</p>
                      </div>
                      <div className="text-center bg-gray-50 p-6 rounded-lg">
                        <Users className="text-robotics-blue mx-auto mb-2" size={32} />
                        <p className="font-bold text-robotics-accent text-xl">Max 6</p>
                        <p className="text-gray-600">Students per Class</p>
                      </div>
                    </div>

                    <div className="bg-robotics-navy text-white p-6 rounded-lg mb-8">
                      <h4 className="font-bold text-xl mb-4 text-robotics-accent">Program Schedule</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="mb-2">📅 <strong>Program Duration:</strong> August 15, 2025 – May 15, 2026</p>
                          <p className="mb-2">❄️ <strong>Winter Break:</strong> December 15, 2025 – January 5, 2026</p>
                        </div>
                        <div>
                          <p className="mb-2">📅 <strong>Weekly Classes:</strong> One session per week</p>
                          <p className="mb-2">⏰ <strong>Options:</strong> Wednesdays or weekends</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <h4 className="font-bold text-2xl text-center text-robotics-navy mb-6">📘 Curriculum Plan by Month</h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 August (3 Weeks)</h5>
                          <p className="font-medium mb-2">Getting Started with VEX EXP</p>
                          <ul className="text-sm space-y-1">
                            <li>• Introduction to Robotics & VEX EXP kits</li>
                            <li>• Basic building concepts</li>
                            <li>• Introduction to VEXcode</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 September</h5>
                          <p className="font-medium mb-2">Mechanics & Drive Systems</p>
                          <ul className="text-sm space-y-1">
                            <li>• Gears, pulleys, and motion</li>
                            <li>• Building drive systems</li>
                            <li>• Programming drive control</li>
                            <li>• Mini challenge – Navigation</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 October</h5>
                          <p className="font-medium mb-2">Sensors & Smart Programming</p>
                          <ul className="text-sm space-y-1">
                            <li>• Introduction to sensors</li>
                            <li>• Sensor integration in code</li>
                            <li>• Looping & conditional logic</li>
                            <li>• Autonomous obstacle navigation</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 November</h5>
                          <p className="font-medium mb-2">Team Collaboration</p>
                          <ul className="text-sm space-y-1">
                            <li>• Team formation and roles</li>
                            <li>• Design process & sketching</li>
                            <li>• Building arm/lift mechanisms</li>
                            <li>• Iterating designs</li>
                          </ul>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 December</h5>
                          <p className="font-medium mb-2">Strategy & Mini Challenges</p>
                          <ul className="text-sm space-y-1">
                            <li>• Game-based strategy</li>
                            <li>• Autonomous + driver control</li>
                            <li>• Winter Break: Dec 15 - Jan 5</li>
                          </ul>
                        </div>

                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 January</h5>
                          <p className="font-medium mb-2">Full Robot Build Phase</p>
                          <ul className="text-sm space-y-1">
                            <li>• Design final robot</li>
                            <li>• Building & programming</li>
                            <li>• Testing & refinement</li>
                          </ul>
                        </div>

                        <div className="bg-pink-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 February</h5>
                          <p className="font-medium mb-2">Advanced Coding</p>
                          <ul className="text-sm space-y-1">
                            <li>• Variables & functions</li>
                            <li>• Tuning autonomous routines</li>
                            <li>• Practice matches</li>
                          </ul>
                        </div>

                        <div className="bg-teal-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 March</h5>
                          <p className="font-medium mb-2">Mock Competition Prep</p>
                          <ul className="text-sm space-y-1">
                            <li>• Strategy refinement</li>
                            <li>• Judging rubric review</li>
                            <li>• Internal mock tournament</li>
                          </ul>
                        </div>

                        <div className="bg-orange-50 p-4 rounded-lg">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 April</h5>
                          <p className="font-medium mb-2">Engineering Notebook</p>
                          <ul className="text-sm space-y-1">
                            <li>• Documentation skills</li>
                            <li>• Design improvements</li>
                            <li>• Presentation development</li>
                          </ul>
                        </div>

                        <div className="bg-gray-100 p-4 rounded-lg md:col-span-2 lg:col-span-1">
                          <h5 className="font-bold text-robotics-navy mb-2">🔹 May</h5>
                          <p className="font-medium mb-2">Final Project Showcase</p>
                          <ul className="text-sm space-y-1">
                            <li>• Final testing & polish</li>
                            <li>• Showcase event for families</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center">
                <Link to="/registration">
                  <Button size="lg" className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy font-bold">
                    Register for Year-Round Classes
                  </Button>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="summer" className="space-y-8">
              <Card className="overflow-hidden shadow-lg max-w-4xl mx-auto">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="font-display font-bold text-3xl mb-4 text-robotics-navy">Summer Robotics Explorers</h3>
                    <p className="text-lg text-gray-600">Intensive 8-week summer program</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <p className="font-bold text-robotics-accent text-2xl">8 Weeks</p>
                      <p className="text-gray-600">Summer Program</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-robotics-accent text-2xl">$100</p>
                      <p className="text-gray-600">Per Month</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-robotics-accent text-2xl">1.5 Hours</p>
                      <p className="text-gray-600">Weekly Classes</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-bold text-xl mb-4">What You'll Learn:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li className="flex items-center gap-2">
                        <span className="text-robotics-blue">•</span>
                        <span>VEX robotics fundamentals</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-robotics-blue">•</span>
                        <span>Basic programming concepts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-robotics-blue">•</span>
                        <span>Engineering design process</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-robotics-blue">•</span>
                        <span>Problem-solving skills</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-robotics-blue">•</span>
                        <span>Teamwork and collaboration</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-robotics-blue">•</span>
                        <span>Competition preparation</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AboutSection />
      <ProgramDetails />
      
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
              Contact Information
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get in touch to learn more about our robotics programs.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div>
                      <h3 className="font-display font-bold text-2xl mb-4 text-robotics-navy">Program Instructors</h3>
                      
                      <div className="space-y-6">
                        <div className="flex items-start gap-3">
                          <Phone className="text-robotics-blue mt-1" />
                          <div>
                            <p className="font-medium">Megha Billore</p>
                            <p className="text-gray-600">603-866-0275</p>
                            <a 
                              href="https://wa.me/16038660275" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-robotics-blue hover:text-robotics-navy mt-1"
                            >
                              <MessageSquare size={16} />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-display font-bold text-xl mb-4">Quick Facts</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>Year-round and summer programs</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>Small class sizes (max 6 students)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>Weekly classes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>Grades 1-5</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>VEX robotics platform</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>All materials provided</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-robotics-navy text-white rounded-lg p-6">
                    <h3 className="font-display font-bold text-xl mb-6">Ready to Start?</h3>
                    <div className="space-y-4">
                      <p>Join our robotics community and give your child the skills for tomorrow!</p>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Phone size={18} />
                          <span>Call or text us at 603-866-0275</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare size={18} />
                          <span>Send us a WhatsApp message</span>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="font-medium mb-2">Program Location</h4>
                        <div className="flex items-start gap-2">
                          <MapPin size={18} className="mt-1 flex-shrink-0" />
                          <p>683 Carryduff St NW, Concord - 28027</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 space-y-3">
                        <Link to="/registration">
                          <Button className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy w-full font-bold">
                            <Bot size={18} className="mr-2" />
                            Register Now
                          </Button>
                        </Link>
                        <Link to="/flyer">
                          <Button variant="outline" className="bg-white text-robotics-navy hover:bg-gray-100 w-full">
                            <Download size={18} className="mr-2" />
                            Download Program Flyer
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
