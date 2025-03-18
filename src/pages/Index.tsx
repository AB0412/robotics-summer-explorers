
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProgramDetails from '@/components/ProgramDetails';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <AboutSection />
      <ProgramDetails />
      
      {/* Registration Section */}
      <section id="register" className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4 text-robotics-navy">
              Register for Summer Camp
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Secure your child's spot in our 12-week robotics summer program. Classes are limited to ensure quality instruction.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2">
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
                      <input type="text" id="childName" className="w-full border border-gray-300 rounded-md px-4 py-2" />
                    </div>
                    <div>
                      <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-1">Child's Age/Grade</label>
                      <input type="text" id="childAge" className="w-full border border-gray-300 rounded-md px-4 py-2" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-1">Parent/Guardian Name</label>
                      <input type="text" id="parentName" className="w-full border border-gray-300 rounded-md px-4 py-2" />
                    </div>
                    <div>
                      <label htmlFor="parentPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input type="tel" id="parentPhone" className="w-full border border-gray-300 rounded-md px-4 py-2" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input type="email" id="email" className="w-full border border-gray-300 rounded-md px-4 py-2" />
                  </div>
                  
                  <div>
                    <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                    <textarea id="comments" rows={4} className="w-full border border-gray-300 rounded-md px-4 py-2"></textarea>
                  </div>
                  
                  <Button type="submit" className="w-full bg-robotics-accent text-robotics-navy hover:bg-robotics-lightblue font-medium">
                    Submit Registration
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-display font-bold text-xl mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="text-robotics-blue mt-1" />
                    <div>
                      <p className="font-medium">Avinash Billore</p>
                      <p className="text-gray-600">603-866-0275</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="text-robotics-blue mt-1" />
                    <div>
                      <p className="font-medium">Megha Billore</p>
                      <p className="text-gray-600">603-930-6748</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-display font-bold text-xl mb-4">Program Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• 12-week summer program</li>
                    <li>• $200 per month</li>
                    <li>• 1.5 hour weekly classes</li>
                    <li>• Grades 2-5</li>
                    <li>• VEX and LEGO robotics</li>
                    <li>• All materials provided</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-robotics-navy text-white py-8">
        <div className="container text-center">
          <p>© 2024 Robotics Summer Explorers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
