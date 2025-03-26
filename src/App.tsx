
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

function App() {
  console.log("App component mounted, initial URL:", window.location.href);
  
  return (
    <Router basename="/">
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
