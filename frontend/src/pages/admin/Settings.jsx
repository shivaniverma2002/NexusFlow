
import { useState } from "react";
import { auth } from "../../config/firebase.js";
import MainLayout from "../../components/layout/MainLayout.jsx";
import { toast } from "sonner";

import {
    Settings as SettingsIcon,
    UserRound,
    Bell,
    Palette,
    Save,
    Mail,
    ShieldCheck
} from "lucide-react";

const Settings = () => {
    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        securityNotifications: true,
        productUpdates: false,
        compactView: false
    });

    const handleToggle = (key) => {
        setPreferences(previous => ({
            ...previous,
            [key]: !previous[key]
        }));
    };

    const handleSave = () => {
        toast.info("Settings interface is ready", {
            description: "Persistent settings storage will be connected through the backend."
        });
    };

    const currentUser = auth.currentUser;

    const options = [
        {
            key: "emailNotifications",
            title: "Email Notifications",
            description: "Receive application updates through email.",
            icon: Mail
        },
        {
            key: "securityNotifications",
            title: "Security Notifications",
            description: "Receive alerts about important account security events.",
            icon: ShieldCheck
        },
        {
            key: "productUpdates",
            title: "Product Updates",
            description: "Receive announcements about new features.",
            icon: Bell
        },
        {
            key: "compactView",
            title: "Compact Interface",
            description: "Enable a more compact dashboard layout.",
            icon: Palette
        }
    ];

    return (
        <MainLayout>
            <div className="mb-8">
                <p className="text-sm font-semibold text-indigo-600">
                    CONFIGURATION
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Settings
                </h1>
                <p className="mt-2 text-slate-500">
                    Manage your administrator account and workspace preferences.
                </p>
            </div>

            {/* Account Information */}
            <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                        <UserRound size={23} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">
                            Administrator Account
                        </h2>
                        <p className="text-sm text-slate-500">
                            Your currently authenticated account.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Display Name
                        </label>
                        <input
                            value={currentUser?.displayName || "Not available"}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-600">
                            Email Address
                        </label>
                        <input
                            value={currentUser?.email || "Not available"}
                            readOnly
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none"
                        />
                    </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                    Account identity is managed through Firebase Authentication.
                </p>
            </section>

            {/* Preferences */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="mb-6 flex items-center gap-3">
                    <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                        <SettingsIcon size={23} />
                    </div>
                    <div>
                        <h2 className="font-bold text-slate-900">
                            Workspace Preferences
                        </h2>
                        <p className="text-sm text-slate-500">
                            Customize your preferred application experience.
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {options.map((option) => {
                        const Icon = option.icon;

                        return (
                            <div
                                key={option.key}
                                className="flex items-center justify-between gap-4 py-5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                                        <Icon size={20} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            {option.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {option.description}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={preferences[option.key]}
                                    onClick={() => handleToggle(option.key)}
                                    className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                                        preferences[option.key]
                                            ? "bg-indigo-600"
                                            : "bg-slate-300"
                                    }`}
                                >
                                    <span
                                        className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
                                            preferences[option.key]
                                                ? "left-6"
                                                : "left-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Save size={17} />
                        Save Preferences
                    </button>
                </div>
            </section>
        </MainLayout>
    );
};

export default Settings;
