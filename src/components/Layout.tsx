import { Outlet, Navigate } from "react-router-dom";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className={isMobile ? "pb-20" : "pb-4"}>
        <Outlet />
      </main>
      {isMobile && <BottomNavigation />}
    </div>
  );
};

export default Layout;