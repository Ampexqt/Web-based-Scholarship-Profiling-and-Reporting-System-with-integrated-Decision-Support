import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';
import LandingPage from './features/landing/LandingPage';
import ApplicationWizard from './features/application/ApplicationWizard';
import LoginPage from './features/auth/LoginPage';
import AdminLayout from './features/admin/layouts/AdminLayout';
import DashboardPage from './features/admin/pages/DashboardPage';
import ApplicationsPage from './features/admin/pages/ApplicationsPage';
import ApplicationReviewPage from './features/staff/pages/ApplicationReviewPage';
import StaffLayout from './features/staff/layouts/StaffLayout';
import StaffDashboardPage from './features/staff/pages/StaffDashboardPage';
import DecisionSupportPage from './features/admin/pages/DecisionSupportPage';
import ReportsPage from './features/admin/pages/ReportsPage';
import AuditLogsPage from './features/admin/pages/AuditLogsPage';
import StaffManagementPage from './features/admin/pages/StaffManagementPage';
import { PriorityGroupDetailsPage } from "./features/shared/pages/PriorityGroupDetailsPage";

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<ApplicationWizard />} />
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/staff" element={<StaffLayout />}>
            <Route index element={<StaffDashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="decision-support" element={<DecisionSupportPage />} />
          </Route>
          <Route path="/staff/applications/:id" element={<ApplicationReviewPage />} />
          <Route path="/staff/priority-groups/:id" element={<PriorityGroupDetailsPage />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="decision-support" element={<DecisionSupportPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="staff-management" element={<StaffManagementPage />} />
            {/* Add more nested admin routes here later */}
          </Route>
          <Route path="/admin/applications/:id" element={<ApplicationReviewPage />} />
          <Route path="/admin/priority-groups/:id" element={<PriorityGroupDetailsPage />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

export default App;
