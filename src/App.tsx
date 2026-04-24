import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/user/ui/sonner";
import { Toaster } from "@/components/user/ui/toaster";
import { TooltipProvider } from "@/components/user/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider, useAuth } from "@/hooks/user/useAuth";
import { ThemeProvider } from "@/hooks/user/useTheme";
import UserNavbar from "@/components/user/Navbar";
import Footer from "@/components/user/Footer";

// User Pages
import UserIndex from "./pages/Index.tsx";
import Login from "./pages/user/Login.tsx";
import Signup from "./pages/user/Signup.tsx";
import Dashboard from "./pages/user/Dashboard.tsx";
import Chat from "./pages/user/Chat.tsx";
import Triage from "./pages/user/Triage.tsx";
import WaitingRoom from "./pages/user/WaitingRoom.tsx";
import VideoConsultation from "./pages/user/VideoConsultation.tsx";
import NotFound from "./pages/user/NotFound.tsx";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/Index.tsx";

const queryClient = new QueryClient();

const UserLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <UserNavbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// Guard: redirects to /login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const role = user?.user_metadata?.role || localStorage.getItem("userRole") || "user";

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          role === "doctor" ? (
            <Navigate to="/doctor/dashboard" replace />
          ) : (
            <UserLayout>
              <UserIndex />
            </UserLayout>
          )
        }
      />

      {/* Auth pages */}
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/signup" element={<UserLayout><Signup /></UserLayout>} />

      {/* Protected user pages */}
      <Route path="/dashboard" element={<ProtectedRoute><UserLayout><Dashboard /></UserLayout></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><UserLayout><Chat /></UserLayout></ProtectedRoute>} />
      <Route path="/triage" element={<ProtectedRoute><UserLayout><Triage /></UserLayout></ProtectedRoute>} />
      <Route path="/waiting" element={<ProtectedRoute><UserLayout><WaitingRoom /></UserLayout></ProtectedRoute>} />

      {/* Video — full screen, no nav/footer */}
      <Route path="/video" element={<ProtectedRoute><VideoConsultation /></ProtectedRoute>} />

      {/* Backward-compat redirects */}
      <Route path="/user/login" element={<Navigate to="/login" replace />} />
      <Route path="/user/signup" element={<Navigate to="/signup" replace />} />
      <Route path="/user/dashboard" element={<Navigate to="/dashboard" replace />} />
      <Route path="/user/chat" element={<Navigate to="/chat" replace />} />
      <Route path="/user/triage" element={<Navigate to="/triage" replace />} />
      <Route path="/user/waiting" element={<Navigate to="/waiting" replace />} />
      <Route path="/user/video" element={<Navigate to="/video" replace />} />

      {/* Doctor routes */}
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor" element={<Navigate to="/doctor/dashboard" replace />} />
      <Route path="/doctor/*" element={<Navigate to="/doctor/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<UserLayout><NotFound /></UserLayout>} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <I18nProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
