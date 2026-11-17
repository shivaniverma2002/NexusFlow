
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    UserRound,
    ShieldCheck,
    Headphones,
    Zap
} from "lucide-react";

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
    
];

const UserSidebar = () => {
    return (
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-slate-200 bg-white px-5 py-6 lg:flex">
            <div className="mb-10 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <Zap size={23} fill="currentColor" />
                </div>

                <div>
                    <h1 className="text-lg font-bold text-slate-900">
                        NexusFlow
                    </h1>
                    <p className="text-xs text-slate-400">
                        User Workspace
                    </p>
                </div>
            </div>

            <p className="mb-3 px-3 text-[10px] font-bold tracking-widest text-slate-400">
                MY WORKSPACE
            </p>

            <nav className="space-y-1">
                {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`
                            }
                        >
                            <Icon size={19} />
                            {item.name}
                        </NavLink>
                    );
                })}
            </nav>

            <div className="mt-auto rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
                <Headphones className="mb-3 text-indigo-600" size={23} />

                <h3 className="text-sm font-semibold text-slate-900">
                    Need assistance?
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Our support section is available whenever you need help.
                </p>

                <NavLink
                    to="/dashboard/support"
                    className="mt-3 inline-block text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                    Contact Support →
                </NavLink>
            </div>

            <p className="mt-5 text-center text-[10px] text-slate-400">
                NEXUSFLOW · USER PORTAL
            </p>
        </aside>
    );
};

export default UserSidebar;
