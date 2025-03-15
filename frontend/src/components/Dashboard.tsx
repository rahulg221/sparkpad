import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>Welcome, {user?.email}!</p>
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};