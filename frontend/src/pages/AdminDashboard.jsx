
import { useState, useEffect } from "react";
import { auth } from "../config/firebase.js";

import MainLayout from "../components/layout/MainLayout.jsx";

import WelcomeSection from "../components/dashboard/WelcomeSection.jsx";
import StatsOverview from "../components/dashboard/StatsOverview.jsx";

import UserSearch from "../components/users/UserSearch.jsx";
import UserTable from "../components/users/UserTable.jsx";
import UserPagination from "../components/users/UserPagination.jsx";
import UserFilters from "../components/users/UserFilter.jsx";
import EditUserModal from "../components/users/EditUserModal.jsx";
import UserDetailsModal from "../components/users/UserDetailsModal.jsx";
import AddUserModal from "../components/users/AddUserModal.jsx";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
const AdminDashboard = () => {
    // Users state
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [role, setRole] = useState("all");
    const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [savingUser, setSavingUser] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Dashboard statistics state
    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState("");
    const [showAddUser, setShowAddUser] = useState(false);
    const [addingUser, setAddingUser] = useState(false);
    const [refreshData, setRefreshData] = useState(0);

    // Handle search and reset pagination
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
    };
    const handleViewUser = (user) => {
        setSelectedUser(user);
        setShowUserDetails(true);
    };
    const handleEditUser = (user) => {
        setEditingUser(user);
    };

    const handleSaveUser = async (userId, updatedData) => {
        try {
            setSavingUser(true);

            const currentUser = auth.currentUser;

            if (!currentUser) {
                throw new Error("Please login again.");
            }

            const token = await currentUser.getIdToken();

            const response = await fetch(
                `http://localhost:5000/api/users/admin/users/${userId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update user");
            }

            // Update the user in the existing table
            setUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user._id === userId
                        ? { ...user, ...updatedData }
                        : user
                )
            );

            setEditingUser(null);

            toast.success("User updated successfully!");

        } catch (error) {
            console.error("Update user error:", error);
            toast.error(error.message);
        } finally {
            setSavingUser(false);
        }
    };

    
const handleToggleStatus = async (user) => {
    const action = user.isActive ? "deactivate" : "activate";

    const result = await Swal.fire({
        title: user.isActive ? "Deactivate User?" : "Activate User?",
        text: user.isActive
            ? `Are you sure you want to deactivate ${user.name}'s account? They will lose access until reactivated.`
            : `Are you sure you want to activate ${user.name}'s account?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: user.isActive ? "Yes, deactivate" : "Yes, activate",
        cancelButtonText: "Cancel",
        confirmButtonColor: user.isActive ? "#e11d48" : "#7c3aed",
        cancelButtonColor: "#64748b",
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
        setUpdatingStatus(true);

        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("Please login again.");
        }

        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:5000/api/users/admin/users/${user._id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    isActive: !user.isActive
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update account status");
        }

        setUsers((previousUsers) =>
            previousUsers.map((item) =>
                item._id === user._id
                    ? { ...item, isActive: !user.isActive }
                    : item
            )
        );

        toast.success(
            `User ${action}d successfully!`,
            {
                description: `${user.name}'s account status has been updated.`
            }
        );

    } catch (error) {
        console.error("Status update error:", error);
        toast.error("Unable to update account", {
            description: error.message
        });
    } finally {
        setUpdatingStatus(false);
    }
};

    // Delete User
  
const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
        title: "Delete User?",
        text: `Are you sure you want to permanently delete ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#e11d48",
        reverseButtons: true
    });

    if (!result.isConfirmed) return;

    try {
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("Please login again.");
        }

        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:5000/api/users/admin/users/${user._id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete user");
        }

        setUsers((prevUsers) =>
            prevUsers.filter((item) => item._id !== user._id)
        );

        toast.success("User deleted successfully!", {
            description: `${user.name} has been removed.`
        });

    } catch (error) {
        console.error("Delete user error:", error);

        toast.error("Unable to delete user", {
            description: error.message
        });
    }
};

    const handleAddUser = async (userData) => {
        try {
            setAddingUser(true);

            const token = await auth.currentUser.getIdToken();

            const response = await fetch(
                "http://localhost:5000/api/users/admin/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(userData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create user");
            }

            setShowAddUser(false);
            setPage(1);
            setRefreshData((previous) => previous + 1);

            toast.success("User created successfully!");

        } catch (error) {
            console.error("Add user error:", error);
            toast.error("Failed to create user");
        } finally {
            setAddingUser(false);
        }
    };

    const handleResetFilters = () => {
        setRole("all");
        setStatus("all");
        setSearch("");
        setPage(1);
    };
    // Fetch users and search results
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const currentUser = auth.currentUser;

                if (!currentUser) {
                    throw new Error("Please login again.");
                }

                const token = await currentUser.getIdToken();

                const response = await fetch(
                    `http://localhost:5000/api/users/admin/users?page=${page}&limit=10&search=${encodeURIComponent(search)}&role=${role === "all" ? "" : role}&isActive=${status === "all" ? "" : status}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch users"
                    );
                }

                setUsers(data.users || []);
                setTotalPages(data.pagination?.totalPages || 1);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [search, page, role, status, refreshData]);

    // Fetch dashboard statistics
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setStatsError("");

                const currentUser = auth.currentUser;

                if (!currentUser) {
                    throw new Error("Please login again.");
                }

                const token = await currentUser.getIdToken();

                const response = await fetch(
                    "http://localhost:5000/api/users/admin/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch statistics"
                    );
                }

                setStats(data.stats);

            } catch (err) {
                setStatsError(err.message);
            }
        };

        fetchStats();
    }, []);

    return (
        <MainLayout>
            {/* Dashboard Welcome Section */}
            <WelcomeSection />

            {/* Dashboard Statistics */}
            <StatsOverview stats={stats} />

            {statsError && (
                <p className="mb-6 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
                    Unable to load dashboard statistics: {statsError}
                </p>
            )}

            {/* Registered Users Section */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Table Header and Search */}
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">

                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Registered Users
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage and monitor your platform users.
                        </p>
                    </div>


                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
                        <UserSearch
                            search={search}
                            setSearch={handleSearchChange}
                        />

                        <UserFilters
                            role={role}
                            setRole={(value) => {
                                setRole(value);
                                setPage(1);
                            }}
                            status={status}
                            setStatus={(value) => {
                                setStatus(value);
                                setPage(1);
                            }}
                            onReset={handleResetFilters}
                        />

                        <button
                            type="button"
                            onClick={() => setShowAddUser(true)}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <UserPlus size={18} strokeWidth={2.2} />
                            <span>Add User</span>
                        </button>
                    </div>

                </div>


                {/* Users Table */}
                <UserTable
                    users={users}
                    loading={loading}
                    error={error}
                    onView={handleViewUser}
                    onEdit={handleEditUser}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteUser}
                    updatingStatus={updatingStatus}
                />
                {showUserDetails && selectedUser && (
                    <UserDetailsModal
                        user={selectedUser}
                        onClose={() => {
                            setShowUserDetails(false);
                            setSelectedUser(null);
                        }}
                    />
                )}

                {/* Pagination */}
                {!loading && !error && (
                    <UserPagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                    />
                )}
            </div>
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={handleSaveUser}
                    saving={savingUser}
                />

            )}
            {showAddUser && (
                <AddUserModal
                    onClose={() => setShowAddUser(false)}
                    onAdd={handleAddUser}
                    loading={addingUser}
                />
            )}
           
        </MainLayout>
    );
};

export default AdminDashboard;
