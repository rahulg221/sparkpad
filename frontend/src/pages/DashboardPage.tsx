import { useAuth } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="dashboard-container">
            <h1>Welcome to your Dashboard</h1>
            <p>Hello, {user.email}</p>
            {/* Add more dashboard content here */}
        </div>
    );
};

export default DashboardPage; 