
import { X, UserRound, Mail, ShieldCheck, Calendar, Activity } from "lucide-react";

const UserDetailsModal = ({ user, onClose }) => {
    if (!user) return null;

    const formattedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })
        : "Not available";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-slate-100 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            User Details
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Account information and activity.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-bold text-indigo-600">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {user.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <DetailRow
                            icon={<UserRound size={18} />}
                            label="Full Name"
                            value={user.name}
                        />

                        <DetailRow
                            icon={<Mail size={18} />}
                            label="Email Address"
                            value={user.email}
                        />

                        <DetailRow
                            icon={<ShieldCheck size={18} />}
                            label="Role"
                            value={user.role}
                        />

                        <DetailRow
                            icon={<Activity size={18} />}
                            label="Account Status"
                            value={user.isActive ? "Active" : "Inactive"}
                        />

                        <DetailRow
                            icon={<Calendar size={18} />}
                            label="Registered On"
                            value={formattedDate}
                        />
                    </div>
                </div>

                <div className="flex justify-end border-t border-slate-100 p-5">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

const DetailRow = ({ icon, label, value }) => (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-3 text-slate-500">
            {icon}
            <span className="text-sm">{label}</span>
        </div>

        <span className="break-all text-right text-sm font-semibold text-slate-800">
            {value || "Not available"}
        </span>
    </div>
);

export default UserDetailsModal;
