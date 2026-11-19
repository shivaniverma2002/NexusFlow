
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const UserRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <p className="p-8 text-center text-sm text-slate-500">
                Verifying access...
            </p>
        );
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (currentUser.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    if (currentUser.role !== "user" || currentUser.isActive === false) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default UserRoute;
