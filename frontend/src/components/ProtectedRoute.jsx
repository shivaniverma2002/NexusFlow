import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Restrict access to authenticated users
const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();

    // Wait until Firebase checks authentication
    if (loading) {
        return <p>Loading...</p>;
    }

    // Redirect unauthenticated users
    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;