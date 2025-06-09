
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
