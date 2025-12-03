import HLSPlayer from "@/components/HLSPlayer";

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
    <HLSPlayer
      src={streamUrl}
      title={channel.name}
      onBack={onBack}
      metadata={{
        channelName: channel.name,
        channelLogo: channel.logo,
        category: `TNT • ${channel.category}`,
        description: `Programme TNT HD`,
      }}
      autoplay={false}
    />
  );
};

export default DVBVideoPlayer;