
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const UserRoute = () => {
    const { currentUser, loading: authLoading } = useAuth();

    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const checkRole = async () => {
            if (authLoading) return;

            if (!currentUser) {
                setRole(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setRole(null);

            try {
                const token = await currentUser.getIdToken();

                const response = await fetch(`${API_URL}/api/users/me`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Access denied");
                }

                if (data.user?.role !== "user" || data.user?.isActive === false) {
                    throw new Error("User access denied");
                }

                if (!cancelled) {
                    setRole(data.user.role);
                }
            } catch (error) {
                console.error("User verification failed:", error.message);

                if (!cancelled) {
                    setRole(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        checkRole();

        return () => {
            cancelled = true;
        };
    }, [currentUser, authLoading]);

    if (authLoading || loading) {
        return (
            <p className="p-8 text-center text-sm text-slate-500">
                Verifying access...
            </p>
        );
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
