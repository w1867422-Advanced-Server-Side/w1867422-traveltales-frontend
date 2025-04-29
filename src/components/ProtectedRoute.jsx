import { Navigate } from 'react-router-dom';
import { useAuth }   from '../features/auth/hooks';
export default function ProtectedRoute({ children }) {
    const { user, bootDone } = useAuth();
    if (!bootDone) return null;
    return user ? children : <Navigate to="/login" replace />;
}