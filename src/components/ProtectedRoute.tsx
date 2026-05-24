import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wraps researcher-only pages. Redirects to /login if not authenticated,
 * or to /explore if authenticated but not a researcher.
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isResearcher, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isResearcher()) {
    return <Navigate to="/explore" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
