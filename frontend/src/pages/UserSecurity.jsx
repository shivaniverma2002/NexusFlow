
import UserLayout from "../components/layout/UserLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import {
    ShieldCheck,
    LockKeyhole,
    Fingerprint,
    Mail,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

const UserSecurity = () => {
    const { currentUser, token } = useAuth();

    return (
        <UserLayout>
            <div className="mb-8">
                <p className="text-sm font-semibold text-indigo-600">
                    ACCOUNT SETTINGS
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Security
                </h1>
                <p className="mt-2 text-slate-500">
                    Review your account authentication and security information.
                </p>
            </div>

            <div className="mb-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 p-7 text-white">
                <ShieldCheck size={35} />
                <h2 className="mt-4 text-2xl font-bold">
                    Your Account Security
                </h2>
                <p className="mt-2 text-sm text-indigo-100">
                    Manage and understand the security features protecting your account.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                            <Fingerprint size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Authentication
                            </h3>
                            <p className="text-xs text-slate-500">
                                JWT Authentication
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 text-sm text-emerald-600">
                        {token ? (
                            <>
                                <CheckCircle2 size={18} />
                                JWT authentication active
                            </>
                        ) : (
                            <>
                                <AlertTriangle size={18} />
                                Authentication session unavailable
                            </>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Registered Email
                            </h3>
                            <p className="text-xs text-slate-500">
                                Your account email
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 break-all text-sm font-medium text-slate-700">
                        {currentUser?.email || "Email unavailable"}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                            <LockKeyhole size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Protected Access
                            </h3>
                            <p className="text-xs text-slate-500">
                                Authenticated API requests
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-500">
                        NexusFlow uses JWT access tokens to authenticate requests
                        to protected backend endpoints.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">
                                Account Protection
                            </h3>
                            <p className="text-xs text-slate-500">
                                Role-based authorization
                            </p>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-500">
                        Backend authorization checks restrict access to resources
                        according to your assigned account role.
                    </p>
                </div>
            </div>

            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <div className="flex gap-3">
                    <AlertTriangle className="shrink-0 text-amber-600" />
                    <div>
                        <h3 className="font-semibold text-amber-900">
                            Security information
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-amber-800">
                            This page displays configured security information.
                            It does not perform a live security audit or change
                            your password.
                        </p>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserSecurity;
