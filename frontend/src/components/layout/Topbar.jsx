
import {
    Search,
    Bell,
    Sparkles,
    LogOut
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService.js";

const Topbar = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
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

                {/* AI badge */}
                <button className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-100 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex">
                    <Sparkles size={15} />
                    AI Copilot
                </button>

                {/* Notifications */}
                <button
                    className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
                    aria-label="Notifications"
                >
                    <Bell size={19} />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
                </button>

                {/* Profile */}
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
                        className="flex items-center gap-2 rounded-xl border border-rose-100 px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Topbar;
