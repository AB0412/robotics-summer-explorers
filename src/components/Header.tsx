
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // Navigate to home page with the hash
      navigate(`/#${sectionId}`);
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Also update the URL hash for better navigation and sharing
      window.history.pushState(null, '', `#${sectionId}`);
    }
  };

  // Try both navigation methods for maximum reliability
  const handleRegisterClick = () => {
    console.log("Register button clicked - trying multiple navigation methods");
    setMobileMenuOpen(false);
    
    try {
      // First try React Router navigation
      navigate('/registration');
      console.log("React Router navigation executed");
      
      // As a backup (in case of navigation issues), use direct URL after a brief delay
      setTimeout(() => {
        if (window.location.pathname !== '/registration') {
          console.log("Fallback to direct URL navigation");
          window.location.href = '/registration';
        }
      }, 100);
    } catch (error) {
      console.error("Navigation error:", error);
      // Last resort - direct navigation
      window.location.href = '/registration';
    }
  };

  return (
    <header className="bg-robotics-navy text-white">
      <div className="container py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Bot size={32} className="text-robotics-accent" />
          <span className="font-display font-bold text-lg sm:text-2xl">Robotics Summer Explorers</span>
        </Link>
        
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
          <Button 
            onClick={handleRegisterClick}
            className="bg-robotics-accent hover:bg-robotics-lightblue text-robotics-navy"
          >
            Register
          </Button>
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
