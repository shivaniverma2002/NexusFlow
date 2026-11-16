import StatCard from "./StatCard.jsx";

import {
    Users,
    ShieldCheck,
    UserCheck,
    UserX
} from "lucide-react";

const StatsOverview = ({ stats }) => {
    if (!stats) return null;

    return (
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon={Users}
                color="indigo"
                description="Total registered accounts"
            />

            <StatCard
                title="Administrators"
                value={stats.totalAdmins}
                icon={ShieldCheck}
                color="violet"
                description="Users with admin access"
            />

            <StatCard
                title="Active Users"
                value={stats.activeUsers}
                icon={UserCheck}
                color="emerald"
                description="Currently active accounts"
            />

            <StatCard
                title="Inactive Users"
                value={stats.inactiveUsers}
                icon={UserX}
                color="rose"
                description="Deactivated accounts"
            />
        </div>
    );
};

export default StatsOverview;