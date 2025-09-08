import { X, Calendar, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TVEPGOverlayProps {
  channel: {
    id: string;
    name: string;
    logo: string;
  };
  onClose: () => void;
}

const TVEPGOverlay = ({ channel, onClose }: TVEPGOverlayProps) => {
  // Mock EPG data
  const epgData = [
    {
      id: "1",
      title: "Journal télévisé",
      description: "L'actualité nationale et internationale présentée par nos équipes de journalistes.",
      startTime: "20:00",
      endTime: "20:30",
      duration: 30,
      category: "Information",
      isLive: true,
      progress: 45,
    },
    {
      id: "2",
      title: "Météo",
      description: "Les prévisions météorologiques détaillées pour toute la France.",
      startTime: "20:30",
      endTime: "20:35",
      duration: 5,
      category: "Information",
      isLive: false,
      progress: 0,
    },
    {
      id: "3",
      title: "Série documentaire",
      description: "Un voyage fascinant à travers les merveilles de la nature sauvage.",
      startTime: "20:35",
      endTime: "21:30",
      duration: 55,
      category: "Documentaire",
      isLive: false,
      progress: 0,
    },
    {
      id: "4",
      title: "Film de soirée",
      description: "Un thriller palpitant avec des stars internationales.",
      startTime: "21:30",
      endTime: "23:15",
      duration: 105,
      category: "Cinéma",
      isLive: false,
      progress: 0,
    },
    {
      id: "5",
      title: "Talk-show",
      description: "Débats et discussions avec des invités prestigieux.",
      startTime: "23:15",
      endTime: "00:30",
      duration: 75,
      category: "Divertissement",
      isLive: false,
      progress: 0,
    },
  ];

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
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
            <div className="space-y-3">
              {epgData.map((program) => (
                <div
                  key={program.id}
                  className={`p-4 rounded-lg border transition-colors hover:bg-accent/50 ${
                    program.isLive 
                      ? "border-primary bg-primary/10" 
                      : "border-border bg-card/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-card-foreground">
                        {program.startTime} - {program.endTime}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({program.duration} min)
                      </span>
                      {program.isLive && (
                        <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs rounded-full">
                          EN DIRECT
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${getCategoryColor(program.category)}`}>
                      {program.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-card-foreground mb-1">
                    {program.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {program.description}
                  </p>

                  {program.isLive && program.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progression</span>
                        <span>{program.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${program.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Info className="w-3 h-3" />
                      <span>Disponible en replay</span>
                    </div>
                    
                    {!program.isLive && (
                      <Button variant="outline" size="sm" className="text-xs">
                        Programmer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default TVEPGOverlay;