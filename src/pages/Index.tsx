
import React from 'react';
import AboutSection from '@/components/AboutSection';
import HeroSection from '@/components/sections/HeroSection';
import ProgramTabsSection from '@/components/sections/ProgramTabsSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <ProgramTabsSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Index;
