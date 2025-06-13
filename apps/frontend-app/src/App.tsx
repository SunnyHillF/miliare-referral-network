import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./layouts/DashboardLayout";
import BusinessPage from "./pages/dashboard/BusinessPage";
import LearnPage from "./pages/dashboard/LearnPage";
import ReferPage from "./pages/dashboard/ReferPage";
import CompanyDetailPage from "./pages/dashboard/CompanyDetailPage";
import TeamPage from "./pages/dashboard/TeamPage";
import AdminPage from "./pages/dashboard/AdminPage";
import DivisionPage from "./pages/dashboard/DivisionPage";
import CompanyAdminPage from "./pages/dashboard/CompanyAdminPage";
import SiteAdminPage from "./pages/dashboard/SiteAdminPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { Toaster } from "./components/ui/Toaster";

// Protected route component
const ProtectedRoute = ({
  children,
  requiredGroup,
  requiredGroups,
}: {
  children: React.ReactNode;
  requiredGroup?: string;
  requiredGroups?: string[];
}) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required group access
  if (
    requiredGroup &&
    !user?.groups?.includes(requiredGroup) &&
    !user?.groups?.includes("admin")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check if user has any of the required groups access
  if (
    requiredGroups &&
    !requiredGroups.some((group) => user?.groups?.includes(group)) &&
    !user?.groups?.includes("admin")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<BusinessPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="refer" element={<ReferPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route
            path="team"
            element={
              <ProtectedRoute requiredGroup="teamLead">
                <TeamPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="division"
            element={
              <ProtectedRoute requiredGroups={["divisionLead"]}>
                <DivisionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="company-admin"
            element={
              <ProtectedRoute requiredGroups={["companyAdmin"]}>
                <CompanyAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="site-admin"
            element={
              <ProtectedRoute requiredGroup="siteAdmin">
                <SiteAdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin"
            element={
              <ProtectedRoute requiredGroup="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="companies/:companyId" element={<CompanyDetailPage />} />
        </Route>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
