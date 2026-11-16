
import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Settings,
    HelpCircle,
    Zap,
    Menu,
    X,
    ChevronRight
} from "lucide-react";

const navigation = [
    {
        title: "WORKSPACE",
        items: [
            { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
            { name: "User Management", path: "/admin/users", icon: Users }
        ]
    },
    {
        title: "CONFIGURATION",
        items: [
            { name: "Security", path: "/admin/security", icon: ShieldCheck },
            { name: "Settings", path: "/admin/settings", icon: Settings }
        ]
    }
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm lg:hidden"
                aria-label="Open navigation"
            >
                <Menu size={22} />
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <button
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden"
                    aria-label="Close navigation overlay"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-white px-5 py-6 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Brand */}
                <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
                            <Zap size={23} fill="currentColor" />
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-slate-900">
                                NexusFlow
                            </h1>
                            <p className="text-[11px] font-medium tracking-wide text-slate-400">
                                AI MANAGEMENT PLATFORM
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        aria-label="Close navigation"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-8">
                    {navigation.map((section) => (
                        <div key={section.title}>
                            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">
                                {section.title}
                            </p>

                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <NavLink
                                            key={item.name}
                                            to={item.path}
                                            onClick={() => setIsOpen(false)}
                                            className={({ isActive }) =>
                                                `group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 ${
                                                    isActive
                                                        ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/60"
                                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <span className="flex items-center gap-3">
                                                        <Icon
                                                            size={19}
                                                            className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-700"}
                                                        />
                                                        {item.name}
                                                    </span>

                                                    {isActive && (
                                                        <ChevronRight size={16} />
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Support card */}
                <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                        <HelpCircle size={19} />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900">
                        Need assistance?
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                        Get help managing your NexusFlow workspace.
                    </p>

                    <button className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800">
                        Contact Support →
                    </button>
                </div>

                <p className="mt-5 text-center text-[10px] text-slate-400">
                    NEXUSFLOW AI · VERSION 1.0
                </p>
            </aside>
        </>
    );
};

export default Sidebar;
