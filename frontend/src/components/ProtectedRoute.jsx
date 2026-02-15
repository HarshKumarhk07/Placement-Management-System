import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullscreenLoader from './FullscreenLoader';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <FullscreenLoader />;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />; // Or unauthorized page
    }

    return <Outlet />;
};

export default ProtectedRoute;
