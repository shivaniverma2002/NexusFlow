
import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { toast } from "sonner";

const AddUserModal = ({ onClose, onAdd, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

 const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
        toast.error("Invalid password", {
            description: "Password must be at least 6 characters long."
        });
        return;
    }

    onAdd({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
    });
};
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                            <UserPlus size={22} />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                Add New User
                            </h2>
                            <p className="text-sm text-slate-500">
                                Create a normal user account
                            </p>
                        </div>
                    </div>

                    <button type="button" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full name"
                        required
                        minLength={2}
                        maxLength={100}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <input
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Temporary password (minimum 6 characters)"
                        minLength={6}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    />

                    <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
                        New accounts are automatically assigned the User role.
                    </div>

                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;
