
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Registration from './pages/Registration';

function App() {
  console.log("App component mounted, initial URL:", window.location.href);
  
  return (
    <Router>
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
