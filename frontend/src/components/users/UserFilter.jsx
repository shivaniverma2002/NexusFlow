
import { Filter, X } from "lucide-react";

const UserFilters = ({
    role,
    setRole,
    status,
    setStatus,
    onReset
}) => {
    const hasFilters = role !== "all" || status !== "all";

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Filter size={16} />
                Filters
            </div>

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
            </select>

            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
                <option value="all">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
            </select>

            {hasFilters && (
                <button
                    onClick={onReset}
                    className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                    <X size={15} />
                    Clear
                </button>
            )}
        </div>
    );
};

export default UserFilters;
