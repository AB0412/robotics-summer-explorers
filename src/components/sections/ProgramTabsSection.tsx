
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProgramTabsSection = () => {
  return (
    <section id="programs" className="py-20 bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
            Choose Your Program
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We offer both regular classes and intensive summer programs to fit your schedule and learning goals.
          </p>
        </div>
        
        <Tabs defaultValue="regular" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="regular" className="text-lg font-medium">Regular Classes</TabsTrigger>
            <TabsTrigger value="summer" className="text-lg font-medium">Summer Program</TabsTrigger>
          </TabsList>
          
          <TabsContent value="regular" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <Bot className="text-robotics-blue mx-auto mb-4" size={64} />
                    <h3 className="font-display font-bold text-3xl mb-4 text-robotics-navy">Robotics Program</h3>
                    <p className="text-lg text-gray-600 mb-6">Comprehensive robotics education with structured curriculum</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center bg-gray-50 p-6 rounded-lg">
                      <Calendar className="text-robotics-blue mx-auto mb-2" size={32} />
                      <p className="font-bold text-robotics-accent text-xl">Aug 15 2025 - May 15 2026</p>
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
                        <p className="mb-2">⏰ <strong>Options:</strong> Weekdays and Weekends</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-lg text-gray-600 mb-4">
                      <Link to="/curriculum" className="text-robotics-blue hover:text-robotics-navy underline">
                        Detailed curriculum available in the Curriculum Page
                      </Link>
                    </p>
                    <Link to="/registration">
                      <Button size="lg" className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy font-bold">
                        Register for Classes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="summer" className="space-y-8">
            <Card className="overflow-hidden shadow-lg max-w-4xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="font-display font-bold text-3xl mb-4 text-robotics-navy">Summer Robotics Explorers</h3>
                  <p className="text-lg text-gray-600 mb-6">Intensive 8-week summer program</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center bg-gray-50 p-6 rounded-lg">
                    <Calendar className="text-robotics-blue mx-auto mb-2" size={32} />
                    <p className="font-bold text-robotics-accent text-xl">8 Weeks</p>
                    <p className="text-gray-600">Summer Program</p>
                  </div>
                  <div className="text-center bg-gray-50 p-6 rounded-lg">
                    <p className="font-bold text-robotics-accent text-xl">$100</p>
                    <p className="text-gray-600">Per Month</p>
                  </div>
                  <div className="text-center bg-gray-50 p-6 rounded-lg">
                    <p className="font-bold text-robotics-accent text-xl">1.5 Hours</p>
                    <p className="text-gray-600">Weekly Classes</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
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
                
                <div className="text-center">
                  <p className="text-lg text-gray-600 mb-4">
                    For detailed curriculum, skills breakdown, and weekly schedule
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/summer-program">
                      <Button size="lg" className="bg-robotics-blue hover:bg-robotics-navy text-white font-bold">
                        View Summer Program Details
                      </Button>
                    </Link>
                    <Link to="/registration">
                      <Button size="lg" className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy font-bold">
                        Register for Summer Program
                      </Button>
                    </Link>
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

export default ProgramTabsSection;
