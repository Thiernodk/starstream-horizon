import { X, Search, Tv } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TVZapListProps {
  channels: Array<{
    id: string;
    name: string;
    logo: string;
    category: string;
    url: string;
  }>;
  currentChannel: {
    id: string;
    name: string;
    logo: string;
    category: string;
    url: string;
  };
  onChannelSelect: (channel: any) => void;
  onClose: () => void;
}

const TVZapList = ({ channels, currentChannel, onChannelSelect, onClose }: TVZapListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-end z-50">
      <div className="bg-card h-full w-full max-w-md border-l border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Tv className="w-5 h-5 text-primary" />
              Liste des chaînes
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une chaîne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-2">
            {filteredChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => onChannelSelect(channel)}
                className={`w-full p-3 rounded-lg mb-2 text-left transition-colors hover:bg-accent/50 ${
                  currentChannel.id === channel.id 
                    ? "bg-primary/20 border border-primary/40" 
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
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
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-card-foreground truncate">
                      {channel.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {channel.category}
                    </div>
                  </div>

                  {currentChannel.id === channel.id && (
                    <div className="w-2 h-2 bg-destructive rounded-full flex-shrink-0 animate-pulse" />
                  )}
                </div>
              </button>
            ))}

            {filteredChannels.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Tv className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucune chaîne trouvée</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border bg-muted/20">
          <div className="text-xs text-muted-foreground text-center">
            {filteredChannels.length} chaîne{filteredChannels.length > 1 ? 's' : ''} disponible{filteredChannels.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVZapList;