
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { logoutUser } from "../services/authService.js";
import { auth } from "../config/firebase.js";
import { toast } from "sonner";
import Swal from "sweetalert2";

import {
    LayoutDashboard,
    UserRound,
    Mail,
    ShieldCheck,
    LogOut,
    Pencil,
    Save,
    X,
    CheckCircle,
    AlertCircle,
    LoaderCircle,
    Headphones
} from "lucide-react";
import UserLayout from "../components/layout/UserLayout.jsx";

const Dashboard = () => {
   const navigation = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Security",
        path: "/dashboard/security",
        icon: ShieldCheck
    },
    {
        name: "Help & Support",
        path: "/dashboard/support",
        icon: Headphones
    }
];
    const { currentUser } = useAuth();

    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [updatedName, setUpdatedName] = useState("");
    const [loading, setLoading] = useState(false);
    

    // Fetch logged-in user's profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setProfileLoading(true);
                setProfileError("");

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
                    throw new Error(data.message || "Unable to fetch profile");
                }

                setProfile(data.user);
                setUpdatedName(data.user.name);

            } catch (error) {
                console.error("Profile fetch failed:", error.message);
                setProfileError(error.message);
            } finally {
                setProfileLoading(false);
            }
        };

        if (currentUser && auth.currentUser) {
            fetchProfile();
        } else {
            setProfileLoading(false);
        }
    }, [currentUser]);

    // Update own profile
    
const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const name = updatedName.trim();

    if (!name) {
        toast.error("Name is required", {
            description: "Please enter your full name."
        });
        return;
    }

    if (name.length > 100) {
        toast.error("Invalid name", {
            description: "Name cannot exceed 100 characters."
        });
        return;
    }

    try {
        setLoading(true);

        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("Please login again.");
        }

        const token = await currentUser.getIdToken();

        const response = await fetch(
            "http://localhost:5000/api/users/me",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Profile update failed");
        }

        setProfile(data.user);
        setUpdatedName(data.user.name);
        setIsEditing(false);

        toast.success("Profile updated successfully!", {
            description: "Your personal information has been saved."
        });

    } catch (error) {
        console.error("Profile update failed:", error);

        toast.error("Profile update failed", {
            description: error.message
        });

    } finally {
        setLoading(false);
    }
};


    // Logout
   
const handleLogout = async () => {
    const result = await Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to log out of your account?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#7c3aed",
        cancelButtonColor: "#64748b",
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
        await logoutUser();

        toast.success("Logged out successfully!");

        navigate("/login", { replace: true });

    } catch (error) {
        console.error("Logout failed:", error);

        toast.error("Logout failed", {
            description: "Unable to logout. Please try again."
        });
    }
};


    return (
        <UserLayout>

            {/* Top Navigation */}
            <header className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">

                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 text-white p-2 rounded-lg">
                            <LayoutDashboard size={22} />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-slate-800">
                                NexusFlow
                            </h1>
                            <p className="text-xs text-slate-500">
                                User Portal
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>

                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* Welcome */}
                <section className="mb-8">
                    <p className="text-sm text-indigo-600 font-semibold mb-2">
                        USER DASHBOARD
                    </p>

                    <h2 className="text-3xl font-bold text-slate-800">
                        Welcome, {profile?.name || currentUser?.displayName || "User"}!
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Manage your personal account and profile information.
                    </p>
                </section>

                {/* Notifications */}
               
                
                {/* Loading */}
                {profileLoading && (
                    <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                        <LoaderCircle className="animate-spin mx-auto text-indigo-600" size={32} />
                        <p className="mt-3 text-slate-500">
                            Loading your profile...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!profileLoading && profileError && (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                        <AlertCircle className="mx-auto text-red-500" size={36} />

                        <h3 className="text-lg font-semibold mt-3">
                            Unable to load profile
                        </h3>

                        <p className="text-slate-500 mt-2">
                            {profileError}
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-5 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Dashboard Content */}
                {!profileLoading && !profileError && profile && (
                    <>
                        {/* Overview Cards */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Account Type
                                        </p>
                                        <h3 className="text-xl font-bold mt-2 capitalize">
                                            {profile.role}
                                        </h3>
                                    </div>
                                    <ShieldCheck className="text-indigo-600" size={30} />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Account Status
                                        </p>
                                        <h3 className="text-xl font-bold mt-2">
                                            {profile.isActive ? "Active" : "Inactive"}
                                        </h3>
                                    </div>
                                    <CheckCircle
                                        className={profile.isActive ? "text-green-600" : "text-red-600"}
                                        size={30}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            Profile
                                        </p>
                                        <h3 className="text-xl font-bold mt-2">
                                            Personal Account
                                        </h3>
                                    </div>
                                    <UserRound className="text-indigo-600" size={30} />
                                </div>
                            </div>

                        </section>

                        {/* Profile Section */}
                        <section className="bg-white rounded-xl shadow-sm border border-slate-100">

                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-800">
                                        My Profile
                                    </h3>
                                    <p className="text-sm text-slate-500 mt-1">
                                        View and manage your personal information.
                                    </p>
                                </div>

                                {!isEditing && (
                                    <button
                                        
                                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                                    >
                                        <Pencil size={16} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            <div className="p-6">

                                {isEditing ? (
                                    <form
                                        onSubmit={handleUpdateProfile}
                                        className="max-w-xl space-y-5"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                value={updatedName}
                                                onChange={(e) => setUpdatedName(e.target.value)}
                                                maxLength={100}
                                                required
                                                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                                                placeholder="Enter your name"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                value={profile.email}
                                                disabled
                                                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-slate-500"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">
                                                Email cannot be changed here.
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                <Save size={16} />
                                                {loading ? "Saving..." : "Save Changes"}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={loading}
                                               
                                                className="flex items-center gap-2 px-5 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                                            >
                                                <X size={16} />
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-full">
                                                <UserRound className="text-indigo-600" size={24} />
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Full Name
                                                </p>
                                                <p className="font-semibold text-slate-800">
                                                    {profile.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-full">
                                                <Mail className="text-indigo-600" size={24} />
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Email Address
                                                </p>
                                                <p className="font-semibold text-slate-800 break-all">
                                                    {profile.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-full">
                                                <ShieldCheck className="text-indigo-600" size={24} />
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Account Role
                                                </p>
                                                <p className="font-semibold text-slate-800 capitalize">
                                                    {profile.role}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div className="bg-indigo-50 p-3 rounded-full">
                                                <CheckCircle className="text-green-600" size={24} />
                                            </div>

                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Account Status
                                                </p>
                                                <p className="font-semibold text-slate-800">
                                                    {profile.isActive ? "Active" : "Inactive"}
                                                </p>
                                            </div>
                                        </div>

                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}

                <footer className="text-center text-sm text-slate-400 mt-10">
                    NexusFlow User Portal
                </footer>

            </main>
        </UserLayout>
    );
};

export default Dashboard;
