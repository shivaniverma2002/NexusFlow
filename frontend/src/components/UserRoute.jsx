
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const UserRoute = () => {
    const { currentUser, loading: authLoading } = useAuth();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!currentUser) {
            setLoading(false);
            return;
        }

        const checkRole = async () => {
            try {
                const token = await currentUser.getIdToken();

                const response = await fetch(
                    "http://localhost:5000/api/users/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Role verification failed");
                }

                setRole(data.user?.role);

            } catch (error) {
                console.error("Role verification failed:", error);
                setRole(null);
            } finally {
                setLoading(false);
            }
        };

        checkRole();
    }, [currentUser, authLoading]);

    if (authLoading || loading) {
        return <p className="p-8 text-center">Verifying user access...</p>;
    }

    if (!currentUser) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "user") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default UserRoute;
