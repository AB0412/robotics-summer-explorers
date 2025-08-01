
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const scrollToSection = (sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // Navigate to home page with the hash
      window.location.href = '/#' + sectionId;
      return;
    }
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      
      // Also update the URL hash for better navigation and sharing
      window.history.pushState(null, '', `#${sectionId}`);
    }
    
    // Close mobile menu if open
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Handle navigation to registration page
  const handleRegisterClick = () => {
    navigate('/registration');
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Handle navigation to curriculum page
  const handleCurriculumClick = () => {
    navigate('/curriculum');
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="bg-robotics-navy text-white">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Bot size={32} className="text-robotics-accent" />
          <span className="font-display font-bold text-lg sm:text-2xl">Bot-Venture</span>
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
            href="#programs" 
            onClick={scrollToSection('programs')} 
            className="hover:text-robotics-accent transition-colors"
          >
            Programs
          </a>
          
          <button
            onClick={handleCurriculumClick}
            className="hover:text-robotics-accent transition-colors"
          >
            Curriculum
          </button>
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
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
