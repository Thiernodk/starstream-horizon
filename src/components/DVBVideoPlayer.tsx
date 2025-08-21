import { useState } from "react";
import { ArrowLeft, Signal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UnifiedVideoPlayer from "@/components/UnifiedVideoPlayer";

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
    <UnifiedVideoPlayer
      src={streamUrl}
      title={currentProgram.title}
      description={currentProgram.description}
      type="video"
      onBack={onBack}
      metadata={{
        genre: `TNT • ${channel.category}`,
        duration: `${currentProgram.startTime} - ${currentProgram.endTime}`,
      }}
    />
  );
};

export default DVBVideoPlayer;