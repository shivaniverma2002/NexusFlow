
import {
    Eye,
    Pencil,
    UserCheck,
    UserX,
    Trash2
} from "lucide-react";

const UserActions = ({
    user,
    onView,
    onEdit,
    onToggleStatus,
    onDelete,
    updatingStatus
}) => {
    const isActive = user.isActive;

    return (
        <div className="flex items-center justify-center gap-2">

            {/* View User */}
            <button
                onClick={() => onView(user)}
                title="View Details"
                className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
            >
                <Eye size={17} />
            </button>

            {/* Edit User */}
            <button
                onClick={() => onEdit(user)}
                title="Edit User"
                className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
            >
                <Pencil size={17} />
            </button>

            {/* Activate / Deactivate */}
            <button
                onClick={() => onToggleStatus(user)}
                disabled={updatingStatus}
                title={isActive ? "Deactivate User" : "Activate User"}
                className={`rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-40 ${isActive
                        ? "text-amber-600 hover:bg-amber-50"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
            >
                {isActive ? (
                    <UserX size={17} />
                ) : (
                    <UserCheck size={17} />
                )}
            </button>

            {/* Delete User */}
            <button
                onClick={() => onDelete(user)}
                title="Delete User"
                className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
            >
                <Trash2 size={17} />
            </button>

        </div>
    );
};

export default UserActions;
