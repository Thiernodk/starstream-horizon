import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";

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
  // Simulated stream URL (in real app, this would come from DVB-T2 tuner)
  const streamUrl = `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;

  return (
    <EnhancedVideoPlayer
      src={streamUrl}
      title="Programme en cours"
      onBack={onBack}
      metadata={{
        channelName: channel.name,
        channelLogo: channel.logo,
        category: `TNT • ${channel.category}`,
        description: `Programme actuellement diffusé sur ${channel.name}. Profitez de la qualité TNT HD directement sur votre appareil.`,
      }}
      autoplay={false}
      controls={true}
    />
  );
};

export default DVBVideoPlayer;