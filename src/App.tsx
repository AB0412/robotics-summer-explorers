
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Registration from './pages/Registration';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import PrintableFlyer from './components/PrintableFlyer';

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
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/flyer" element={<PrintableFlyer />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
