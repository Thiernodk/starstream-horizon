import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  isLive?: boolean;
}

interface ChannelGridProps {
  channels: Channel[];
  onChannelClick?: (channel: Channel) => void;
}

const ChannelGrid = ({ channels, onChannelClick }: ChannelGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {channels.map((channel) => (
        <Button
          key={channel.id}
          variant="card"
          className="relative aspect-square p-4 flex flex-col items-center justify-center group"
          onClick={() => onChannelClick?.(channel)}
        >
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-card rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <img 
                src={channel.logo} 
                alt={channel.name}
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=${channel.name.charAt(0)}`;
                }}
              />
            </div>
            
            {channel.isLive && (
              <div className="absolute -top-1 -right-1 flex items-center gap-1 bg-destructive text-destructive-foreground px-2 py-1 rounded-full text-xs">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-sm line-clamp-2">{channel.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{channel.category}</p>
          </div>
          
          <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <Play className="w-8 h-8 text-white" />
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ChannelGrid;