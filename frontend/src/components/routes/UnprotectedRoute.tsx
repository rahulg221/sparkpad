import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const UnprotectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}; 