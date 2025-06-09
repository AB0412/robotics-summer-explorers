
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Lazy load components for better performance
const Index = lazy(() => import('./pages/Index'));
const Registration = lazy(() => import('./pages/Registration'));
const Admin = lazy(() => import('./pages/Admin'));
const Payments = lazy(() => import('./pages/Payments'));
const SummerProgram = lazy(() => import('./pages/SummerProgram'));
const Curriculum = lazy(() => import('./pages/Curriculum'));
const ScheduleManagement = lazy(() => import('./pages/ScheduleManagement'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/summer-program" element={<SummerProgram />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/schedule-management" element={<ScheduleManagement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
