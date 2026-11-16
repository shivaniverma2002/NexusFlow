import { logoutUser } from "../services/authService.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase.js";

const Dashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = await auth.currentUser.getIdToken();
                        

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
                    throw new Error(data.message);
                }

                setProfile(data.user);
            } catch (error) {
                console.error("Profile fetch failed:", error.message);
            }
        };

        if (auth.currentUser) {
            fetchProfile();
        }
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error.message);
        }
    };

   return (
    <div>
        <h1>Dashboard Page</h1>

        <h2>
            Welcome, {currentUser?.displayName || currentUser?.email}
        </h2>

        <p>Email: {currentUser?.email}</p>

        {/* MongoDB Profile Information */}
        {profile ? (
            <div>
                <h3>MongoDB Profile</h3>
                <p>Name: {profile.name}</p>
                <p>Email: {profile.email}</p>
                <p>Role: {profile.role}</p>
                <p>
                    Account Status: {profile.isActive ? "Active" : "Inactive"}
                </p>
            </div>
        ) : (
            <p>Loading profile...</p>
        )}

        <button onClick={handleLogout}>Logout</button>
    </div>
);
};

export default Dashboard;