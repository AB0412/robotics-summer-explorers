
import React from 'react';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ProgramDetails from '@/components/ProgramDetails';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      
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
              Get in touch to learn more about our 8-week robotics summer program for grades 1-5.
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
                      <h3 className="font-display font-bold text-xl mb-4">Program Details</h3>
                      <ul className="space-y-2 text-gray-600">
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>8-week summer program</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>$100 per month</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>1.5 hour weekly classes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>Grades 1-5</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>VEX robotics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-robotics-blue">•</span>
                          <span>All materials provided</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-robotics-navy text-white rounded-lg p-6">
                    <h3 className="font-display font-bold text-xl mb-6">Contact Us</h3>
                    <div className="space-y-4">
                      <p>To register your child or learn more about our program, please contact us directly by phone or WhatsApp.</p>
                      
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
                        <p className="mt-2">Limited spots available!</p>
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

