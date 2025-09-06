import { X, Calendar, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { EPGProgram } from "@/hooks/useEPG";

interface TVEPGOverlayProps {
  channel: {
    id: string;
    name: string;
    logo: string;
  };
  programs: EPGProgram[];
  loading: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const TVEPGOverlay = ({ channel, programs, loading, onClose, onRefresh }: TVEPGOverlayProps) => {
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const formatDuration = (start: Date, stop: Date) => {
    const duration = Math.round((stop.getTime() - start.getTime()) / (1000 * 60));
    return `${duration} min`;
  };

  const isCurrentProgram = (program: EPGProgram) => {
    const now = new Date();
    return program.start <= now && program.stop > now;
  };

  const getProgressPercentage = (program: EPGProgram) => {
    if (!isCurrentProgram(program)) return 0;
    const now = new Date();
    const total = program.stop.getTime() - program.start.getTime();
    const elapsed = now.getTime() - program.start.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toLowerCase()) {
      case "information":
        return "text-destructive";
      case "documentaire":
        return "text-success";
      case "cinéma":
      case "cinema":
        return "text-warning";
      case "divertissement":
        return "text-primary";
      case "sport":
        return "text-blue-500";
      default:
        return "text-muted-foreground";
    }
  };

  const groupProgramsByDate = (programs: EPGProgram[]) => {
    const grouped: { [key: string]: EPGProgram[] } = {};
    
    programs.forEach(program => {
      const dateKey = program.start.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(program);
    });
    
    return grouped;
  };

  const groupedPrograms = groupProgramsByDate(programs);

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
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2 text-muted-foreground">Chargement du guide TV...</span>
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">Aucun programme disponible</p>
                <Button onClick={onRefresh} variant="outline" size="sm">
                  Actualiser
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedPrograms).map(([date, dayPrograms]) => (
                  <div key={date}>
                    <h3 className="text-lg font-semibold text-card-foreground mb-3 sticky top-0 bg-card/95 backdrop-blur-sm py-2 border-b border-border">
                      {new Date(date).toLocaleDateString("fr-FR", { 
                        weekday: "long", 
                        day: "numeric", 
                        month: "long" 
                      })}
                    </h3>
                    
                    <div className="space-y-3">
                      {dayPrograms.map((program) => (
                        <div
                          key={program.id}
                          className={`p-4 rounded-lg border transition-colors hover:bg-accent/50 ${
                            isCurrentProgram(program)
                              ? "border-primary bg-primary/10" 
                              : "border-border bg-card/50"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium text-card-foreground">
                                {formatTime(program.start)} - {formatTime(program.stop)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({formatDuration(program.start, program.stop)})
                              </span>
                              {isCurrentProgram(program) && (
                                <Badge variant="destructive" className="text-xs">
                                  EN DIRECT
                                </Badge>
                              )}
                            </div>
                            {program.category && (
                              <Badge variant="outline" className={`text-xs ${getCategoryColor(program.category)}`}>
                                {program.category}
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-card-foreground mb-1">
                            {program.title}
                          </h3>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {program.description}
                          </p>

                          {isCurrentProgram(program) && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progression</span>
                                <span>{Math.round(getProgressPercentage(program))}%</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-1.5">
                                <div 
                                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${getProgressPercentage(program)}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Info className="w-3 h-3" />
                              <span>Disponible en replay</span>
                            </div>
                            
                            {!isCurrentProgram(program) && (
                              <Button variant="outline" size="sm" className="text-xs">
                                Programmer
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TVEPGOverlay;