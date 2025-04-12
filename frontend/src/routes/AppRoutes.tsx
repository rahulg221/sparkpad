import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import { SignUpPage } from "../pages/SignUpPage";
import { DashboardPage } from "../pages/DashboardPage";
import LandingPage from "../pages/LandingPage";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/" element={<DashboardPage />} />
                <Route path="/auth/google/callback" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;