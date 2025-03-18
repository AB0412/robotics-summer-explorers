
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-robotics-navy text-white">
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot size={32} className="text-robotics-accent" />
          <span className="font-display font-bold text-lg sm:text-2xl">Robotics Summer Explorers</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <a href="#about" className="hover:text-robotics-accent transition-colors">About</a>
          <a href="#program" className="hover:text-robotics-accent transition-colors">Program</a>
          <a href="#contact" className="hover:text-robotics-accent transition-colors">Contact</a>
        </nav>
        
        <Button className="md:hidden bg-robotics-accent text-robotics-navy hover:bg-robotics-lightblue">
          Menu
        </Button>
      </div>
    </header>
  );
};

export default Header;
