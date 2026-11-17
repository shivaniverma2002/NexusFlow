
import MainLayout from "../../components/layout/MainLayout.jsx";
import {
    ShieldCheck,
    LockKeyhole,
    Fingerprint,
    Database,
    Server,
    KeyRound,
    CheckCircle2,
    AlertTriangle
} from "lucide-react";

const securityItems = [
    {
        title: "Firebase Authentication",
        description: "User sign-in and identity management are handled through Firebase Authentication.",
        icon: Fingerprint,
        status: "Integrated"
    },
    {
        title: "Token Verification",
        description: "The backend verifies Firebase ID tokens before allowing protected API requests.",
        icon: KeyRound,
        status: "Integrated"
    },
    {
        title: "Role-Based Access",
        description: "Admin and user permissions are enforced through backend authorization middleware.",
        icon: LockKeyhole,
        status: "Integrated"
    },
    {
        title: "Database Protection",
        description: "MongoDB stores application profiles and role information.",
        icon: Database,
        status: "Integrated"
    }
];

const Security = () => {
    return (
        <MainLayout>
            <div className="mb-8">
                <p className="text-sm font-semibold text-indigo-600">
                    CONFIGURATION
                </p>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Security Center
                </h1>
                <p className="mt-2 text-slate-500">
                    Review authentication, authorization and application security.
                </p>
            </div>

            <div className="mb-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white">
                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/15 p-4">
                        <ShieldCheck size={34} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">
                            Security Architecture
                        </h2>
                        <p className="mt-1 text-sm text-indigo-100">
                            Authentication and authorization controls configured in NexusFlow.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-7 grid grid-cols-1 gap-5 md:grid-cols-2">
                {securityItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-slate-200 bg-white p-6"
                        >
                            <div className="flex items-start justify-between">
                                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                    <Icon size={24} />
                                </div>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {item.status}
                                </span>
                            </div>

                            <h3 className="mt-5 font-bold text-slate-900">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                {item.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-1 shrink-0 text-amber-600" />
                    <div>
                        <h3 className="font-bold text-amber-900">
                            Security verification required
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-amber-800">
                            This page describes the configured security architecture.
                            It does not perform a live security audit. Verify production
                            HTTPS, CORS, secret management, rate limits, account recovery
                            and authorization behavior before deployment.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                    <Server className="text-indigo-600" size={23} />
                    <h3 className="font-bold text-slate-900">
                        Security recommendations
                    </h3>
                </div>

                <ul className="mt-5 space-y-4 text-sm text-slate-600">
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-600" size={18} />
                        Keep Firebase service-account credentials outside Git.
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-600" size={18} />
                        Validate all incoming API data on the backend.
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-600" size={18} />
                        Enforce role permissions on every protected backend route.
                    </li>
                    <li className="flex items-center gap-3">
                        <CheckCircle2 className="text-emerald-600" size={18} />
                        Use HTTPS and production-specific environment variables.
                    </li>
                </ul>
            </div>
        </MainLayout>
    );
};

export default Security;
