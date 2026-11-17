
import {
    Search,
    Bell,
    LogOut,
    CheckCircle,
    Clock,
    X,
    MessageSquare
} from "lucide-react";

import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService.js";
import { auth } from "../../config/firebase.js";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const API_URL = "${import.meta.env.VITE_API_URL}/support";

const Topbar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [resolvingId, setResolvingId] = useState(null);

    const notificationRef = useRef(null);

    // Fetch admin support notifications
    const fetchNotifications = async (showLoader = false) => {
        try {
            if (!auth.currentUser) return;

            if (showLoader) setLoadingNotifications(true);

            const token = await auth.currentUser.getIdToken();

            const response = await fetch(`${API_URL}/notifications`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch notifications");
            }

            setNotifications(data.requests || []);
            setUnreadCount(data.unreadCount || 0);

        } catch (error) {
            console.error("FETCH NOTIFICATIONS ERROR:", error);
        } finally {
            if (showLoader) setLoadingNotifications(false);
        }
    };

    // Initial fetch and polling every 15 seconds
    useEffect(() => {
        fetchNotifications(true);

        const interval = setInterval(() => {
            fetchNotifications();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Mark notification as read
    const handleMarkAsRead = async (requestId) => {
        try {
            const token = await auth.currentUser.getIdToken();

            const response = await fetch(
                `${API_URL}/notifications/${requestId}/read`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to mark as read");
            }

            setNotifications((prev) =>
                prev.map((item) =>
                    item._id === requestId
                        ? { ...item, isRead: true }
                        : item
                )
            );

            setUnreadCount((prev) => Math.max(0, prev - 1));

        } catch (error) {
            console.error("MARK AS READ ERROR:", error);
            toast.error(error.message);
        }
    };

    // Resolve support request
    const handleResolve = async (requestId) => {
        try {
            setResolvingId(requestId);

            const token = await auth.currentUser.getIdToken();

            const response = await fetch(
                `${API_URL}/${requestId}/resolve`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to resolve request");
            }

            // Remove immediately from notification dropdown
            setNotifications((prev) =>
                prev.filter((item) => item._id !== requestId)
            );

            // Refresh unread count from backend
            await fetchNotifications();

            toast.success("Support request resolved successfully!");

        } catch (error) {
            console.error("RESOLVE REQUEST ERROR:", error);
            toast.error(error.message || "Unable to resolve request");
        } finally {
            setResolvingId(null);
        }
    };

    // Logout
    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await logoutUser();

            toast.success("Logged out successfully!");
            navigate("/login", { replace: true });

        } catch (error) {
            console.error("Logout failed:", error);

            toast.error("Logout failed", {
                description: "Unable to logout. Please try again."
            });
        } finally {
            setIsLoggingOut(false);
        }
    };

    const userName = currentUser?.displayName || "Administrator";
    const userEmail = currentUser?.email || "";
    const initial = userName.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/90 px-5 backdrop-blur-xl sm:px-8 lg:px-10">

            {/* Page heading */}
            <div className="ml-12 lg:ml-0">
                <p className="text-xs font-medium text-slate-400">
                    Workspace / Overview
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                    Dashboard
                </h2>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3 sm:gap-5">

                {/* Search */}
                <div className="hidden w-64 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-indigo-300 focus-within:bg-white md:flex">
                    <Search size={17} className="text-slate-400" />

                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />

                    <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">
                        /
                    </span>
                </div>

                {/* Notifications */}
                <div className="relative" ref={notificationRef}>
                    <button
                        onClick={() => setShowNotifications((prev) => !prev)}
                        className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                        aria-label="Notifications"
                    >
                        <Bell size={19} />

                        {unreadCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-14 z-50 w-[350px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-[400px]">

                            {/* Dropdown header */}
                            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        Support Notifications
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        {unreadCount} unread requests
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Notification list */}
                            <div className="max-h-[420px] overflow-y-auto">

                                {loadingNotifications ? (
                                    <div className="p-8 text-center text-sm text-slate-400">
                                        Loading notifications...
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Bell
                                            size={30}
                                            className="mx-auto mb-2 text-slate-300"
                                        />
                                        <p className="text-sm font-medium text-slate-600">
                                            No pending notifications
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            New support requests will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((request) => (
                                        <div
                                            key={request._id}
                                            className={`border-b border-slate-100 p-4 ${
                                                !request.isRead ? "bg-indigo-50/40" : ""
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">

                                                <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                                                    <MessageSquare size={18} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <p className="truncate text-sm font-semibold text-slate-800">
                                                            {request.subject}
                                                        </p>

                                                        {!request.isRead && (
                                                            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                                                        )}
                                                    </div>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        From: {request.name}
                                                    </p>

                                                    <p className="mt-2 break-words text-xs text-slate-600">
                                                        {request.message}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                                                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                                                            <Clock size={12} />
                                                            {new Date(request.createdAt).toLocaleString()}
                                                        </span>

                                                        <div className="flex items-center gap-2">
                                                            {!request.isRead && (
                                                                <button
                                                                    onClick={() => handleMarkAsRead(request._id)}
                                                                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
                                                                >
                                                                    Mark read
                                                                </button>
                                                            )}

                                                            <button
                                                                onClick={() => handleResolve(request._id)}
                                                                disabled={resolvingId === request._id}
                                                                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                            >
                                                                <CheckCircle size={13} />
                                                                {resolvingId === request._id
                                                                    ? "Resolving..."
                                                                    : "Resolve"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">
                                <p className="text-center text-[11px] text-slate-400">
                                    Refreshes automatically every 15 seconds
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile and Logout */}
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-sm font-bold text-indigo-700">
                        {initial}
                    </div>

                    <div className="hidden text-left sm:block">
                        <p className="text-xs font-semibold text-slate-800">
                            {userName}
                        </p>
                        <p className="max-w-32 truncate text-[10px] text-slate-400">
                            {userEmail}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                        <LogOut size={17} />
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Topbar;
