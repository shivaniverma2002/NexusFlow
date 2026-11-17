
import UserSidebar from "./UserSidebar.jsx";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <UserSidebar />

      <main className="min-h-screen lg:pl-[260px]">
        <div className="p-5 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
