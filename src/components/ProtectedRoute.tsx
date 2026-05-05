import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/lib/auth';

interface Props {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

const ProtectedRoute = ({ children, allowedRole }: Props) => {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'doctor' ? '/doctor' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;