
import { useState } from "react";
import MainLayout from "../../components/layout/MainLayout.jsx";
import { toast } from "sonner";

import {
    Headphones,
    Mail,
    MessageSquare,
    Send,
    UserRound,
    HelpCircle
} from "lucide-react";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm(previous => ({
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
            toast.error("Message is too short", {
                description: "Please provide at least 10 characters."
            });
            return;
        }

        setLoading(true);

        try {
            // Support API integration is pending.
            toast.info("Support form is ready", {
                description: "Message delivery will be enabled after the support API is connected."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="mb-8">
                <p className="text-sm font-semibold text-indigo-600">
                    SUPPORT
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Contact Us
                </h1>
                <p className="mt-2 text-slate-500">
                    Have a question or need assistance? Send us a message.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">

                {/* Support Information */}
                <div className="space-y-5">
                    <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 p-7 text-white">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
                            <Headphones size={27} />
                        </div>

                        <h2 className="text-xl font-bold">
                            We're here to help
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-indigo-100">
                            Contact the NexusFlow support team for assistance
                            with your workspace and account.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                <MessageSquare size={21} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    General Support
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Questions about NexusFlow
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-violet-50 p-3 text-violet-600">
                                <HelpCircle size={21} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Technical Assistance
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Report technical problems
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
                    <h2 className="text-xl font-bold text-slate-900">
                        Send us a message
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Fill out the form below with your query.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <UserRound className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        maxLength={100}
                                        required
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        maxLength={254}
                                        required
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Subject
                            </label>
                            <input
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="What do you need help with?"
                                maxLength={150}
                                required
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Your Message
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Describe your issue or question..."
                                rows={6}
                                maxLength={3000}
                                required
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
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                <Send size={17} />
                                {loading ? "Processing..." : "Submit Message"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
};

export default ContactUs;
