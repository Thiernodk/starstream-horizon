import { Outlet, Navigate } from "react-router-dom";
import SmartTVNavigation from "./SmartTVNavigation";
import { useAuth } from "@/hooks/useAuth";

const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SmartTVNavigation />
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;