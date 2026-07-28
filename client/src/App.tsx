import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import LandingPage from './features/landing/LandingPage';
import ApplicationWizard from './features/application/ApplicationWizard';
import LoginPage from './features/auth/LoginPage';
import AdminLayout from './features/admin/layouts/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplicationWizard />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Add more nested admin routes here later */}
          </Route>
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

export default App;
