
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

function ScrollToHashElement() {
  const location = useLocation();
  
  useEffect(() => {
    // If the URL has a hash, scroll to that element
    if (location.hash) {
      const elementId = location.hash.substring(1); // remove the # character
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  
  return null; // This component doesn't render anything
}

function App() {
  return (
    <Router>
      <ScrollToHashElement />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
