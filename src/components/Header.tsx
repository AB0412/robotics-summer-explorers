
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're on the home page
    if (window.location.pathname !== '/') {
      // Navigate to home page with the hash
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Also update the URL hash for better navigation and sharing
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  // Use direct URL navigation which is most reliable
  const handleRegisterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Register button clicked - using direct window.location");
    setMobileMenuOpen(false);
    
    // Use direct URL navigation
    window.location.href = '/registration';
  };

  return (
    <header className="bg-robotics-navy text-white">
      <div className="container py-4 flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <Bot size={32} className="text-robotics-accent" />
          <span className="font-display font-bold text-lg sm:text-2xl">Robotics Summer Explorers</span>
        </a>
        
        <nav className={`${mobileMenuOpen ? 'flex flex-col absolute top-16 right-0 bg-robotics-navy p-4 rounded-bl-lg shadow-lg z-50' : 'hidden md:flex'} items-center gap-8 font-medium`}>
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
          <a 
            href="/registration" 
            onClick={handleRegisterClick}
            className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy px-4 py-2 rounded-md"
          >
            Register
          </a>
        </nav>
        
        <div className="md:hidden">
          <Button 
            className="bg-robotics-accent text-robotics-navy hover:bg-robotics-lightblue"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
