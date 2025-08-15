import { Home, Tv, Radio, Video, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { icon: Home, path: "/", label: "Accueil" },
    { icon: Tv, path: "/tv", label: "TV" },
    { icon: Radio, path: "/radios", label: "Radios" },
    { icon: Video, path: "/vod", label: "VOD" },
    { icon: Menu, path: "/menu", label: "Menu" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t border-border">
      <div className="flex items-center justify-around py-2 px-4 max-w-lg mx-auto">
        {navigationItems.map(({ icon: Icon, path, label }) => {
          const isActive = location.pathname === path;
          return (
            <Button
              key={path}
              variant="nav"
              size="icon"
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col gap-1 h-14 w-14",
                isActive && "text-primary"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive && "animate-pulse-glow")} />
              <span className="text-xs font-medium">{label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;