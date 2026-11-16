
const UserTable = ({ users, loading, error }) => {
    if (loading) {
        return (
            <p className="p-8 text-center text-sm text-slate-500">
                Loading users...
            </p>
        );
    }

    if (error) {
        return (
            <p className="p-8 text-center text-sm text-rose-600">
                {error}
            </p>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
                <thead className="bg-slate-50">
                    <tr>
                        {["User", "Email", "Role", "Status"].map((heading) => (
                            <th
                                key={heading}
                                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500"
                            >
                                {heading}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr
                                key={user._id}
                                className="transition hover:bg-slate-50/80"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 font-semibold text-indigo-600">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-800">
                                            {user.name}
                                        </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                        user.role === "admin"
                                            ? "bg-violet-50 text-violet-700"
                                            : "bg-slate-100 text-slate-600"
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>

                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                                        user.isActive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-rose-50 text-rose-700"
                                    }`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${
                                            user.isActive
                                                ? "bg-emerald-500"
                                                : "bg-rose-500"
                                        }`} />
                                        {user.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan="4"
                                className="px-6 py-12 text-center text-sm text-slate-500"
                            >
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
