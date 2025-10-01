import { X, Calendar, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEPG } from "@/hooks/useEPG";

interface TVEPGOverlayProps {
  channel: {
    id: string;
    name: string;
    logo: string;
    tvgId?: string;
    epgUrl?: string;
  };
  onClose: () => void;
}

const TVEPGOverlay = ({ channel, onClose }: TVEPGOverlayProps) => {
  const { getTodayPrograms, getCurrentProgram, loading } = useEPG({ 
    channelTvgId: channel.tvgId, 
    epgUrl: channel.epgUrl 
  });

  const programs = getTodayPrograms();
  const currentProgram = getCurrentProgram();

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getDuration = (start: Date, stop: Date) => {
    return Math.round((stop.getTime() - start.getTime()) / (1000 * 60)); // minutes
  };

  const getProgress = (program: any) => {
    if (program.id !== currentProgram?.id) return 0;
    const now = new Date();
    const total = program.stopTime.getTime() - program.startTime.getTime();
    const elapsed = now.getTime() - program.startTime.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Information":
        return "text-destructive";
      case "Documentaire":
        return "text-success";
      case "Cinéma":
        return "text-warning";
      case "Divertissement":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border w-full max-w-2xl h-[80vh] mx-4 overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-muted rounded overflow-hidden">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/48x32/0EA5E9/FFFFFF?text=${encodeURIComponent(
                      channel.name.slice(0, 3)
                    )}`;
                  }}
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Guide TV - {channel.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Actuellement: {getCurrentTime()}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-80px)]">
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : programs.length > 0 ? (
              <div className="space-y-3">
                {programs.map((program) => {
                  const isCurrentProgram = currentProgram?.id === program.id;
                  const duration = getDuration(program.startTime, program.stopTime);
                  const progress = getProgress(program);
                  
                  return (
                    <div
                      key={program.id}
                      className={`p-4 rounded-lg border transition-colors hover:bg-accent/50 ${
                        isCurrentProgram 
                          ? "border-primary bg-primary/10" 
                          : "border-border bg-card/50"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium text-card-foreground">
                            {formatTime(program.startTime)} - {formatTime(program.stopTime)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({duration} min)
                          </span>
                          {isCurrentProgram && (
                            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                              EN DIRECT
                            </span>
                          )}
                        </div>
                        {program.category && (
                          <span className={`text-xs font-medium ${getCategoryColor(program.category)}`}>
                            {program.category}
                          </span>
                        )}
                      </div>

                      <h3 className="font-semibold text-card-foreground mb-1">
                        {program.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {program.description}
                      </p>

                      {isCurrentProgram && progress > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Progression</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info className="w-3 h-3" />
                          <span>Disponible en replay</span>
                        </div>
                        
                        {!isCurrentProgram && (
                          <Button variant="outline" size="sm" className="text-xs">
                            Programmer
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Aucune programmation disponible pour cette chaîne
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TVEPGOverlay;