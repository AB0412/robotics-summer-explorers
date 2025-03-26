
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Registration from './pages/Registration';

// This component will add logging for route changes
const RouteLogger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("Current route:", location.pathname);
  }, [location]);
  
  return null;
};

// This component will handle hash-based navigation
function App() {
  // Effect to handle hash-based navigation when the app first loads
  useEffect(() => {
    console.log("App component mounted, initial URL:", window.location.href);
    
    // Handle initial load with hash
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      
      if (element) {
        // Small delay to ensure the DOM is fully loaded
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
    
    // Add hash change listener for when the URL hash changes
    const handleHashChange = () => {
      if (window.location.hash) {
        const id = window.location.hash.substring(1);
        const element = document.getElementById(id);
        
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  console.log("App component rendering with routes");
  
  return (
    <Router>
      <RouteLogger />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
