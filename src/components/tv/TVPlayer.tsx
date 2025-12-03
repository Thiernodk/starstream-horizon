import HLSPlayer from "@/components/HLSPlayer";

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
    <HLSPlayer
      src={channel.url}
      title={channel.name}
      onBack={onBack}
      metadata={{
        channelName: channel.name,
        channelLogo: channel.logo,
        category: channel.category,
        description: "Programme en direct",
      }}
      autoplay={true}
    />
  );
};

export default TVPlayer;
