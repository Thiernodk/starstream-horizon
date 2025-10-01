import { Outlet } from "react-router-dom";
import SmartTVNavigation from "./SmartTVNavigation";

const Layout = () => {
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