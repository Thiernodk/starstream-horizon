import { Home, Tv, Radio, Video, Menu, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const SmartTVNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [focusedIndex, setFocusedIndex] = useState(0);

  const navigationItems = [
    { icon: Home, path: "/", label: "Accueil" },
    { icon: Tv, path: "/tv", label: "TV en Direct" },
    { icon: Radio, path: "/radios", label: "Radios" },
    { icon: Video, path: "/vod", label: "VOD" },
    { icon: Menu, path: "/menu", label: "Menu" },
  ];

  // Keyboard navigation for TV remote
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setFocusedIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setFocusedIndex((prev) => Math.min(navigationItems.length - 1, prev + 1));
      } else if (e.key === "Enter") {
        navigate(navigationItems[focusedIndex].path);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, navigate]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Tv className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            N.S Stream
          </h1>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-2">
          {navigationItems.map(({ icon: Icon, path, label }, index) => {
            const isActive = location.pathname === path;
            const isFocused = index === focusedIndex;
            
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200",
                  "hover:bg-accent/50 hover:scale-105",
                  isActive && "bg-primary text-primary-foreground shadow-glow",
                  !isActive && "text-foreground/70",
                  isFocused && "ring-2 ring-primary"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            );
          })}
          
          {/* Settings */}
          <button
            onClick={() => navigate("/menu")}
            className="ml-4 p-3 rounded-lg hover:bg-accent/50 transition-colors text-foreground/70 hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SmartTVNavigation;
