
import { ChevronLeft, ChevronRight } from "lucide-react";

const UserPagination = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null;

    return (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 px-5 py-4 sm:flex-row">
            <p className="text-sm text-slate-500">
                Page <span className="font-semibold text-slate-800">{page}</span>
                {" "}of{" "}
                <span className="font-semibold text-slate-800">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>

                <button
                    onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default UserPagination;
