
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

const MainLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="min-h-screen lg:pl-[280px]">

                {/* Top navigation */}
                <Topbar />

                {/* Page content */}
                <main className="p-5 sm:p-8 lg:p-10">
                    <div className="mx-auto w-full max-w-[1600px]">
                        {children}
                    </div>
                </main>

            </div>
        </div>
    );
};

export default MainLayout;
