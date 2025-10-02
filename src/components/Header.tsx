import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: "/", label: "Accueil" },
    { path: "/tv", label: "TV" },
    { path: "/radios", label: "Radios" },
    { path: "/vod", label: "VOD" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">N.S Stream</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-white">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <User className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <nav className="flex gap-6">
          {navigationItems.map(({ path, label }) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={cn(
                  "text-white/70 hover:text-white transition-colors pb-2 border-b-2 border-transparent",
                  isActive && "text-white border-primary"
                )}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;