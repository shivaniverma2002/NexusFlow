
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import { Toaster } from "sonner";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";

import AdminDashboard from "./pages/AdminDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";

import Security from "./pages/admin/Security.jsx";
import Settings from "./pages/admin/Settings.jsx";

import AdminRoute from "./components/AdminRoute.jsx";
import UserRoute from "./components/UserRoute.jsx";

import UserSecurity from "./pages/UserSecurity.jsx";
import UserSupport from "./pages/UserSupport.jsx";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/security"
            element={<Security />}
          />

          <Route
            path="/admin/settings"
            element={<Settings />}
          />
        </Route>

        {/* Protected User Routes */}
        <Route element={<UserRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/dashboard/security"
            element={<UserSecurity />}
          />

          <Route
            path="/dashboard/support"
            element={<UserSupport />}
          />
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
