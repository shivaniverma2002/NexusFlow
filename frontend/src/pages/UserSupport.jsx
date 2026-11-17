
import { useState } from "react";
import { toast } from "sonner";
import UserLayout from "../components/layout/UserLayout.jsx";
import { auth } from "../config/firebase.js";

import {
    Headphones,
    Mail,
    MessageSquare,
    Send,
    UserRound,
    LoaderCircle
} from "lucide-react";

const UserSupport = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm((previous) => ({
            ...previous,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.subject.trim() ||
            !form.message.trim()
        ) {
            toast.error("Please complete all fields.");
            return;
        }

        if (form.message.trim().length < 10) {
            toast.error("Please provide at least 10 characters.");
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
                "${import.meta.env.VITE_API_URL}/support",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        email: form.email.trim(),
                        subject: form.subject.trim(),
                        message: form.message.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to submit support request."
                );
            }

            toast.success("Support request submitted successfully!", {
                description: "Our team will review your request."
            });

            setForm({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

        } catch (error) {
            console.error("Support request error:", error);

            toast.error("Unable to submit request", {
                description: error.message
            });

        } finally {
            setLoading(false);
        }
    };

    return (
        <UserLayout>
            <div className="mb-8">
                <p className="text-sm font-semibold text-indigo-600">
                    HELP CENTER
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Help & Support
                </h1>

                <p className="mt-2 text-slate-500">
                    Have a question? We're here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">

                <div className="space-y-5">
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-7 text-white">
                        <Headphones size={34} />

                        <h2 className="mt-5 text-xl font-bold">
                            How can we help?
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-indigo-100">
                            Contact the NexusFlow team if you experience
                            problems with your account or need assistance.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <Mail className="mb-3 text-indigo-600" size={23} />

                        <h3 className="font-semibold text-slate-900">
                            Account Support
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Questions about your account and profile.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <MessageSquare
                            className="mb-3 text-violet-600"
                            size={23}
                        />

                        <h3 className="font-semibold text-slate-900">
                            Technical Support
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Report application problems or errors.
                        </p>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-900">
                        Submit a Support Request
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Describe your issue so our team can understand it.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-7 space-y-5"
                    >
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <UserRound
                                        className="absolute left-3 top-3.5 text-slate-400"
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        maxLength={100}
                                        placeholder="Your name"
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    maxLength={254}
                                    placeholder="you@example.com"
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Subject
                            </label>

                            <input
                                type="text"
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                                maxLength={150}
                                placeholder="Enter your subject"
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Message
                            </label>

                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                minLength={10}
                                maxLength={3000}
                                rows={6}
                                placeholder="Describe your problem..."
                                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />

                            <p className="mt-1 text-right text-xs text-slate-400">
                                {form.message.length}/3000
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <LoaderCircle
                                            size={17}
                                            className="animate-spin"
                                        />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send size={17} />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserSupport;
