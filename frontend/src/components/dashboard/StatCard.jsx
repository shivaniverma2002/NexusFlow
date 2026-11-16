
const StatCard = ({ title, value, icon: Icon, color, description }) => {
    const colorStyles = {
        indigo: "bg-indigo-50 text-indigo-600",
        violet: "bg-violet-50 text-violet-600",
        emerald: "bg-emerald-50 text-emerald-600",
        rose: "bg-rose-50 text-rose-600"
    };

    return (
        <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 sm:p-6">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                        {value ?? 0}
                    </h3>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${colorStyles[color] || colorStyles.indigo}`}>
                    <Icon size={23} />
                </div>
            </div>

            <p className="mt-4 text-xs text-slate-400">
                {description}
            </p>
        </div>
    );
};

export default StatCard;
