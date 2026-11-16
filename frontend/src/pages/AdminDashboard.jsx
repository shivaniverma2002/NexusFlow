
import { useState, useEffect } from "react";
import { auth } from "../config/firebase.js";

import MainLayout from "../components/layout/MainLayout.jsx";

import WelcomeSection from "../components/dashboard/WelcomeSection.jsx";
import StatsOverview from "../components/dashboard/StatsOverview.jsx";

import UserSearch from "../components/users/UserSearch.jsx";
import UserTable from "../components/users/UserTable.jsx";
import UserPagination from "../components/users/UserPagination.jsx";
import UserFilters from "../components/users/UserFilter.jsx";

const AdminDashboard = () => {
    // Users state
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
const [status, setStatus] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
   
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Dashboard statistics state
    const [stats, setStats] = useState(null);
    const [statsError, setStatsError] = useState("");

    // Handle search and reset pagination
    const handleSearchChange = (value) => {
        setSearch(value);
        setPage(1);
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
    }, [search, page,role,status]);

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

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
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
</div>
                </div>

                {/* Users Table */}
                <UserTable
                    users={users}
                    loading={loading}
                    error={error}
                />

                {/* Pagination */}
                {!loading && !error && (
                    <UserPagination
                        page={page}
                        totalPages={totalPages}
                        setPage={setPage}
                    />
                )}
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;
