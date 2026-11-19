
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const AdminRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <p className="p-8 text-center">
                Verifying admin access...
            </p>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
