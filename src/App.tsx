import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Registration from './pages/Registration';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import ScheduleManagement from './pages/ScheduleManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="registration" element={<Registration />} />
          <Route path="admin" element={<Admin />} />
          <Route path="schedule-management" element={<ScheduleManagement />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
