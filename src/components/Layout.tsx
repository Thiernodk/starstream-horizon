import { Outlet } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const Layout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="pb-20">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default Layout;