
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-robotics-navy text-white py-8">
      <div className="container mx-auto text-center px-4">
        <p>© {new Date().getFullYear()} Robotics Summer Explorers. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
