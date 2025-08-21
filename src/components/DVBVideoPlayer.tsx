import { useState } from "react";
import { ArrowLeft, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UnifiedVideoPlayer from "./UnifiedVideoPlayer";

interface DVBVideoPlayerProps {
  channel: {
    id: string;
    name: string;
    logo: string;
    category: string;
    signal: number;
  };
  onBack: () => void;
}

const DVBVideoPlayer = ({ channel, onBack }: DVBVideoPlayerProps) => {
  // Mock program data
  const currentProgram = {
    title: "Programme en cours",
    description: `Programme actuellement diffusé sur ${channel.name}. Profitez de la qualité TNT HD directement sur votre appareil.`,
    startTime: "20:00",
    endTime: "22:00",
  };

  // Simulated stream URL (in real app, this would come from DVB-T2 tuner)
  const streamUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;

  return (
    <div className="min-h-screen bg-black">
      {/* Custom header for DVB-T2 */}
      <div className="flex items-center gap-4 p-4 bg-black text-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="flex items-center gap-3 flex-1">
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-10 h-10 rounded object-contain bg-white/10 p-1"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/40x40/0EA5E9/FFFFFF?text=${encodeURIComponent(
                channel.name.slice(0, 2)
              )}`;
            }}
          />
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{channel.name}</h1>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>{channel.category}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Signal className="w-3 h-3" />
                <span>{channel.signal}%</span>
                <Badge 
                  variant={channel.signal >= 90 ? "default" : channel.signal >= 80 ? "secondary" : "destructive"}
                  className="text-xs px-1 py-0"
                >
                  {channel.signal >= 90 ? "Excellent" : channel.signal >= 80 ? "Bon" : "Faible"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="aspect-video">
        <UnifiedVideoPlayer
          src={streamUrl}
          title={currentProgram.title}
          description={currentProgram.description}
          type="video"
          onBack={onBack}
          metadata={{
            genre: "TNT",
            duration: `${currentProgram.startTime} - ${currentProgram.endTime}`,
          }}
        />
      </div>

      {/* Channel Info */}
      <div className="text-white p-4">
        <div className="bg-gradient-to-r from-blue-600/20 to-blue-400/20 rounded-lg p-4 border border-blue-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Signal className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-semibold">Diffusion TNT (DVB-T2)</h3>
              <p className="text-sm text-white/70">Signal terrestre numérique</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Qualité:</span>
              <span className="ml-2 font-medium">HD 1080p</span>
            </div>
            <div>
              <span className="text-white/60">Fréquence:</span>
              <span className="ml-2 font-medium">UHF</span>
            </div>
            <div>
              <span className="text-white/60">Signal:</span>
              <span className="ml-2 font-medium">{channel.signal}%</span>
            </div>
            <div>
              <span className="text-white/60">Standard:</span>
              <span className="ml-2 font-medium">DVB-T2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DVBVideoPlayer;