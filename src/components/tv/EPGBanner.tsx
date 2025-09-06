import { Clock, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EPGProgram } from "@/hooks/useEPG";

interface EPGBannerProps {
  current: EPGProgram | null;
  next: EPGProgram | null;
  channelLogo?: string;
  channelName: string;
  onOpenFullEPG: () => void;
  showControls: boolean;
}

const EPGBanner = ({ 
  current, 
  next, 
  channelLogo, 
  channelName, 
  onOpenFullEPG, 
  showControls 
}: EPGBannerProps) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getProgressPercentage = (program: EPGProgram) => {
    const now = new Date();
    const total = program.stop.getTime() - program.start.getTime();
    const elapsed = now.getTime() - program.start.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "information":
        return "bg-destructive/20 text-destructive";
      case "divertissement":
        return "bg-primary/20 text-primary";
      case "cinéma":
      case "cinema":
        return "bg-warning/20 text-warning";
      case "sport":
        return "bg-success/20 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (!showControls) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4">
      <div className="flex items-center justify-between">
        {/* Channel Logo */}
        <div className="flex items-center gap-3">
          {channelLogo && (
            <div className="w-16 h-10 bg-card/20 rounded border border-white/20 overflow-hidden backdrop-blur-sm">
              <img
                src={channelLogo}
                alt={channelName}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/64x40/0EA5E9/FFFFFF?text=${encodeURIComponent(
                    channelName.slice(0, 3)
                  )}`;
                }}
              />
            </div>
          )}
        </div>

        {/* EPG Content */}
        <div className="flex-1 mx-4 space-y-2">
          {/* Current Program */}
          {current && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="text-xs">
                  EN DIRECT
                </Badge>
                {current.category && (
                  <Badge variant="outline" className={`text-xs ${getCategoryColor(current.category)}`}>
                    {current.category}
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-white/80 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>
                    {formatTime(current.start)} - {formatTime(current.stop)}
                  </span>
                </div>
              </div>
              
              <h3 className="text-white font-semibold text-sm line-clamp-1">
                {current.title}
              </h3>
              
              <p className="text-white/70 text-xs line-clamp-1">
                {current.description}
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-1000"
                  style={{ width: `${getProgressPercentage(current)}%` }}
                />
              </div>
            </div>
          )}

          {/* Next Program */}
          {next && (
            <div className="pt-1 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <ChevronRight className="w-3 h-3" />
                <span>À suivre:</span>
                <span>{formatTime(next.start)}</span>
                <span className="font-medium text-white/80">{next.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Full EPG Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenFullEPG}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
        >
          <Calendar className="w-4 h-4 mr-1" />
          Guide TV
        </Button>
      </div>
    </div>
  );
};

export default EPGBanner;