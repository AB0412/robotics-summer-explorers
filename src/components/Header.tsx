
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

const Header = () => {
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Also update the URL hash for better navigation and sharing
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  return (
    <header className="bg-robotics-navy text-white">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={32} className="text-robotics-accent" />
          <span className="font-display font-bold text-lg sm:text-2xl">Robotics Summer Explorers</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <a 
            href="#about" 
            onClick={scrollToSection('about')} 
            className="hover:text-robotics-accent transition-colors"
          >
            About
          </a>
          <a 
            href="#program" 
            onClick={scrollToSection('program')} 
            className="hover:text-robotics-accent transition-colors"
          >
            Program
          </a>
          <a 
            href="#contact" 
            onClick={scrollToSection('contact')} 
            className="hover:text-robotics-accent transition-colors"
          >
            Contact
          </a>
        </nav>
        
        <Button className="md:hidden bg-robotics-accent text-robotics-navy hover:bg-robotics-lightblue">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;
