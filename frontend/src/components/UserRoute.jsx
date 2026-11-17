
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const UserRoute = () => {
    const { currentUser, loading: authLoading } = useAuth();
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        if (authLoading) return;

        setLoading(true);
        setRole(null);
        const checkRole = async () => {
            if (authLoading) return;

            if (!currentUser) {
                setLoading(false);
                return;
            }

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
                    throw new Error(data.message || "Access denied");
                }

                if (!cancelled) setRole(data.user?.role);
            } catch (error) {
                console.error("User verification failed:", error.message);
                if (!cancelled) setRole(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        checkRole();

        return () => {
            cancelled = true;
        };
    }, [currentUser, authLoading]);

    if (authLoading || loading) {
        return <p className="p-8 text-center">Verifying access...</p>;
    }

    if (!currentUser || role !== "user") {
        return (
            <Navigate
                to={role === "admin" ? "/admin/dashboard" : "/login"}
                replace
            />
        );
    }

    return <Outlet />;
};

export default UserRoute;
