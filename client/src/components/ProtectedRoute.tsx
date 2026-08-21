import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  // For now, we check a simple localStorage flag.
  // In a full implementation, this would check an AuthContext that verifies with the backend /api/auth/me
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
