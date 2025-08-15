import { useState } from "react";
import { Search, ArrowLeft, Tv as TvIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChannelGrid from "@/components/ChannelGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { useM3UParser } from "@/hooks/useM3UParser";
import channelsBg from "@/assets/channels-bg.jpg";

const TV = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Parse M3U playlist from the provided URL
  const { channels: m3uChannels, loading, error } = useM3UParser("https://iptv-org.github.io/iptv/languages/fra.m3u");

  // Convert M3U channels to our format
  const channels = m3uChannels.map(channel => ({
    id: channel.id,
    name: channel.name,
    logo: channel.logo,
    category: channel.group,
    isLive: true,
    url: channel.url
  }));

  // Get unique categories from channels
  const categories = ["Toutes", ...Array.from(new Set(channels.map(ch => ch.category)))];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleChannelClick = (channel: any) => {
    setSelectedChannel(channel);
    setShowPlayer(true);
  };

  if (showPlayer && selectedChannel) {
    return (
      <div className="min-h-screen bg-black">
        {/* Player Header */}
        <div className="flex items-center gap-4 p-4 bg-black/50 text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowPlayer(false)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <img src={selectedChannel.logo} alt={selectedChannel.name} className="w-8 h-8 rounded" />
            <h1 className="text-lg font-semibold">{selectedChannel.name}</h1>
          </div>
        </div>

        {/* Video Player */}
        <div className="aspect-video">
          <VideoPlayer
            src={selectedChannel.url}
            title={selectedChannel.name}
            type="hls"
            className="w-full h-full"
          />
        </div>

        {/* Channel Info */}
        <div className="p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <TvIcon className="w-4 h-4" />
            <span className="text-sm text-white/70">{selectedChannel.category}</span>
            {selectedChannel.isLive && (
              <span className="px-2 py-1 bg-red-600 text-xs rounded-full">LIVE</span>
            )}
          </div>
          <p className="text-white/80 text-sm">
            Diffusion en direct de {selectedChannel.name}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with background */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={channelsBg} 
          alt="Channels background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">TV en Direct</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {loading && (
          <div className="text-center py-8">
            <p className="text-white">Chargement des chaînes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-lg mb-4">
            <p>Erreur: {error}</p>
            <p className="text-sm mt-1">Utilisation des chaînes de démonstration.</p>
          </div>
        )}

        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une chaîne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Channels grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {selectedCategory === "Toutes" ? "Toutes les chaînes" : selectedCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredChannels.length} chaîne{filteredChannels.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <ChannelGrid 
            channels={filteredChannels}
            onChannelClick={handleChannelClick}
          />
        </div>
      </div>
    </div>
  );
};

export default TV;