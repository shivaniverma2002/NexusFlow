
import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";

const EditUserModal = ({ user, onClose, onSave, saving }) => {
    const [name, setName] = useState(user?.name || "");

    useEffect(() => {
        setName(user?.name || "");
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (name.trim().length < 2) return;

        onSave(user._id, {
            name: name.trim()
        });
    };

    if (!user) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b p-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Edit User
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Update user information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Full Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            minLength={2}
                            maxLength={100}
                            required
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={user.email}
                            disabled
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                        />
                    </div>

                    <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
                        Role: User. Account permissions cannot be changed here.
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border px-4 py-2.5 text-sm font-semibold text-slate-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving || name.trim().length < 2}
                            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            <Save size={16} />
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
