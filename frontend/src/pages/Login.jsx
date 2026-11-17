
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.js";

import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Code2,
    ChartNoAxesCombined,
    CloudUpload,
    CheckCircle,
    LayoutDashboard,
    FolderKanban,
    Sparkles,
    LoaderCircle
} from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const redirectUser = async (user) => {
        const token = await user.getIdToken();

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
            throw new Error(data.message || "Profile verification failed");
        }

        if (data.user?.isActive === false) {
            await auth.signOut();
            throw new Error("Your account is inactive. Contact the administrator.");
        }

        navigate(
            data.user.role === "admin"
                ? "/admin/dashboard"
                : "/dashboard",
            { replace: true }
        );
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const result = await signInWithEmailAndPassword(
                auth,
                email.trim(),
                password
            );

            await redirectUser(result.user);

        } catch (err) {
            console.error("Login failed:", err);
            setError(err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const result = await signInWithPopup(auth, googleProvider);

            await redirectUser(result.user);

        } catch (err) {
            console.error("Google login failed:", err);
            setError(err.message || "Google login failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address first.");
            return;
        }

        try {
            setLoading(true);

            await sendPasswordResetEmail(auth, email.trim());

            setSuccess("Password reset email sent. Please check your inbox.");

        } catch (err) {
            setError(err.message || "Unable to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">

            {/* LEFT BRANDING PANEL */}
            <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-12 text-white bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700">

                {/* Background decorations */}
                <div className="absolute w-96 h-96 rounded-full bg-white/10 blur-3xl -top-32 -right-20" />
                <div className="absolute w-80 h-80 rounded-full bg-fuchsia-300/20 blur-3xl bottom-0 left-0" />

                {/* Logo */}
                <h1 className="relative z-10 text-3xl font-bold tracking-tight">
                    NexusFlow<span className="text-purple-200">.</span>
                </h1>

                <div className="relative z-10">

                    <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-2 text-sm mb-5">
                        <Sparkles size={16} />
                        Productivity Platform
                    </div>

                    <h2 className="text-4xl font-bold leading-tight max-w-lg">
                        Welcome back to your workspace.
                    </h2>

                    <p className="text-purple-100 mt-4 text-lg max-w-lg">
                        Sign in to access your dashboard and manage
                        everything from one secure place.
                    </p>

                    {/* Custom dashboard illustration */}
                    <div className="relative mt-12 mb-10 h-72 flex items-center justify-center">

                        {/* Laptop screen */}
                        <div className="relative w-[85%] h-60 bg-slate-900 rounded-t-2xl border-4 border-slate-400 shadow-2xl p-3">

                            <div className="h-full bg-white rounded-lg overflow-hidden flex">

                                {/* Sidebar */}
                                <div className="w-1/3 bg-indigo-950 text-white p-3 space-y-5">

                                    <p className="font-bold text-xs">
                                        NexusFlow.
                                    </p>

                                    <p className="text-xs flex gap-2 items-center">
                                        <LayoutDashboard size={13} />
                                        Dashboard
                                    </p>

                                    <p className="text-xs flex gap-2 items-center">
                                        <FolderKanban size={13} />
                                        Projects
                                    </p>

                                    <p className="text-xs flex gap-2 items-center">
                                        <Code2 size={13} />
                                        Development
                                    </p>

                                    <p className="text-xs flex gap-2 items-center">
                                        <ChartNoAxesCombined size={13} />
                                        Analytics
                                    </p>
                                </div>

                                {/* Dashboard content */}
                                <div className="flex-1 p-4 text-slate-800">

                                    <p className="text-sm font-bold">
                                        Welcome back 👋
                                    </p>

                                    <p className="text-[9px] text-slate-400 mt-1">
                                        Your workspace overview
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 mt-5">

                                        <div className="bg-indigo-50 rounded-lg p-3">
                                            <p className="text-xs text-slate-500">
                                                Projects
                                            </p>
                                            <p className="text-xl font-bold text-indigo-700">
                                                24
                                            </p>
                                        </div>

                                        <div className="bg-purple-50 rounded-lg p-3">
                                            <p className="text-xs text-slate-500">
                                                Tasks
                                            </p>
                                            <p className="text-xl font-bold text-purple-700">
                                                86
                                            </p>
                                        </div>

                                    </div>

                                    <div className="mt-4 bg-purple-50 rounded-lg p-3">

                                        <div className="flex justify-between items-center">
                                            <p className="text-xs font-semibold">
                                                Performance
                                            </p>

                                            <ChartNoAxesCombined
                                                size={18}
                                                className="text-purple-600"
                                            />
                                        </div>

                                        <div className="flex items-end gap-2 h-12 mt-2">
                                            <div className="w-1/6 h-5 bg-indigo-300 rounded-t" />
                                            <div className="w-1/6 h-8 bg-indigo-400 rounded-t" />
                                            <div className="w-1/6 h-6 bg-purple-400 rounded-t" />
                                            <div className="w-1/6 h-10 bg-purple-500 rounded-t" />
                                            <div className="w-1/6 h-8 bg-indigo-500 rounded-t" />
                                            <div className="w-1/6 h-12 bg-purple-600 rounded-t" />
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Laptop base */}
                        <div className="absolute bottom-0 w-[92%] h-3 bg-slate-300 rounded-b-full shadow-xl" />

                        {/* Floating icons */}
                        <div className="absolute top-0 left-5 bg-white text-purple-700 p-4 rounded-2xl shadow-xl">
                            <Code2 size={30} />
                        </div>

                        <div className="absolute top-2 right-5 bg-white text-purple-700 p-4 rounded-2xl shadow-xl">
                            <ChartNoAxesCombined size={30} />
                        </div>

                        <div className="absolute bottom-8 right-0 bg-white text-purple-700 p-4 rounded-2xl shadow-xl">
                            <CloudUpload size={30} />
                        </div>

                        <div className="absolute bottom-8 left-0 bg-white text-purple-700 p-4 rounded-2xl shadow-xl">
                            <CheckCircle size={30} />
                        </div>

                    </div>

                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-3">

                        <span className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-3 text-sm">
                            <ShieldCheck size={18} />
                            Secure Authentication
                        </span>

                        <span className="flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-3 text-sm">
                            <ChartNoAxesCombined size={18} />
                            Smart Dashboard
                        </span>

                    </div>

                </div>

                <p className="relative z-10 text-sm text-purple-100">
                    © 2026 NexusFlow. All rights reserved.
                </p>

            </div>

            {/* RIGHT LOGIN FORM */}
            <div className="flex items-center justify-center px-6 py-10 sm:px-12">

                <div className="w-full max-w-md">

                    {/* Mobile logo */}
                    <div className="lg:hidden text-2xl font-bold text-indigo-700 mb-10">
                        NexusFlow.
                    </div>

                    <div className="mb-8">

                        <div className="inline-flex p-3 rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                            <ShieldCheck size={28} />
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900">
                            Sign in to your account
                        </h2>

                        <p className="text-slate-500 mt-2">
                            Enter your details to continue.
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 mb-5 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div className="p-3 mb-5 rounded-lg bg-green-50 border border-green-100 text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">
                                <Mail
                                    className="absolute left-3 top-3.5 text-slate-400"
                                    size={19}
                                />

                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>

                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-3.5 text-slate-400"
                                    size={19}
                                />

                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-12 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-slate-400 hover:text-indigo-600"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword
                                        ? <EyeOff size={19} />
                                        : <Eye size={19} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot password */}
                        <div className="text-right">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                disabled={loading}
                                className="text-sm text-indigo-600 font-medium hover:text-purple-700 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle size={19} className="animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={19} />
                                </>
                            )}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="relative my-7">
                        <div className="border-t border-slate-200" />

                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-4 text-sm text-slate-400">
                            OR
                        </span>
                    </div>

                    {/* Google login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 border border-slate-200 rounded-xl py-3 font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.2 13.22l7.98 6.19C13.08 13.72 18.11 9.5 24 9.5z" transform="translate(0 4)" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.1 7.14-10.14 7.14-17.56z" />
                            <path fill="#FBBC05" d="M10.18 28.59a14.4 14.4 0 0 1 0-9.18L2.2 13.22a23.9 23.9 0 0 0 0 21.56l7.98-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.89l-7.62-5.91c-2.12 1.42-4.84 2.27-8.29 2.27-5.89 0-10.92-4.22-12.82-9.91L3.2 34.78C6.51 42.62 14.62 48 24 48z" />
                        </svg>

                        Continue with Google
                    </button>

                    {/* Signup link */}
                    <p className="text-center text-sm text-slate-500 mt-8">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-indigo-600 font-semibold hover:text-purple-700"
                        >
                            Create account
                        </Link>
                    </p>

                </div>
            </div>

        </div>
    );
}
