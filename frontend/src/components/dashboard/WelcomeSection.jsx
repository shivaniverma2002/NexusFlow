import { CheckCircle2 } from "lucide-react";

const WelcomeSection = () => {
    return (
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
                <p className="text-sm font-medium text-indigo-600">
                    OVERVIEW
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Welcome to NexusFlow
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Monitor users, manage access, and track your workspace activity.
                </p>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3">
                <p className="text-xs font-medium text-indigo-500">
                    WORKSPACE STATUS
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-indigo-700">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    Management Active
                </p>
            </div>
        </div>
    );
};

export default WelcomeSection;