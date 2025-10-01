import EnhancedVideoPlayer from "@/components/EnhancedVideoPlayer";

interface TVPlayerProps {
  channel: {
    id: string;
    name: string;
    logo: string;
    category: string;
    url: string;
    tvgId?: string;
    epgUrl?: string;
  };
  onBack: () => void;
  channels: Array<{
    id: string;
    name: string;
    logo: string;
    category: string;
    url: string;
    tvgId?: string;
    epgUrl?: string;
  }>;
  onChannelChange: (channel: any) => void;
}

const TVPlayer = ({ channel, onBack, channels, onChannelChange }: TVPlayerProps) => {
  return (
    <EnhancedVideoPlayer
      src={channel.url}
      title="Programme en cours"
      onBack={onBack}
      metadata={{
        channelName: channel.name,
        channelLogo: channel.logo,
        category: channel.category,
        tvgId: channel.tvgId,
        epgUrl: channel.epgUrl,
        description: "Programme actuellement diffusé sur cette chaîne",
      }}
      autoplay={true}
      controls={true}
    />
  );
};

export default TVPlayer;
