
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Registration from './pages/Registration';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  console.log("App component mounted, initial URL:", window.location.href);
  
  return (
    <Router basename="/">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/admin" element={<Admin />} />
        {/* Fallback for any other route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
