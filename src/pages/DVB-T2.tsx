import { useState } from "react";
import { Search, Signal, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UnifiedVideoPlayer from "@/components/UnifiedVideoPlayer";
import TVPlayer from "@/components/tv/TVPlayer";

const DVBT2 = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Sample DVB-T2 channels with EPG support
  const channels = [
    { 
      id: "1", 
      name: "TF1 HD", 
      logo: "https://via.placeholder.com/48x48/DC2626/FFFFFF?text=TF1", 
      category: "Généraliste", 
      isLive: true, 
      signal: 95,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "tf1hd.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "2", 
      name: "France 2 HD", 
      logo: "https://via.placeholder.com/48x48/1D4ED8/FFFFFF?text=F2", 
      category: "Généraliste", 
      isLive: true, 
      signal: 92,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "france2hd.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "3", 
      name: "France 3", 
      logo: "https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=F3", 
      category: "Généraliste", 
      isLive: true, 
      signal: 88,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "france3.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "4", 
      name: "Canal+", 
      logo: "https://via.placeholder.com/48x48/000000/FFFFFF?text=C+", 
      category: "Cinéma", 
      isLive: true, 
      signal: 90,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "canalplus.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "5", 
      name: "France 5", 
      logo: "https://via.placeholder.com/48x48/059669/FFFFFF?text=F5", 
      category: "Documentaires", 
      isLive: true, 
      signal: 85,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "france5.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "6", 
      name: "M6 HD", 
      logo: "https://via.placeholder.com/48x48/7C3AED/FFFFFF?text=M6", 
      category: "Généraliste", 
      isLive: true, 
      signal: 93,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "m6hd.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "7", 
      name: "Arte", 
      logo: "https://via.placeholder.com/48x48/F59E0B/FFFFFF?text=Arte", 
      category: "Culture", 
      isLive: true, 
      signal: 87,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "arte.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    },
    { 
      id: "8", 
      name: "C8", 
      logo: "https://via.placeholder.com/48x48/DC2626/FFFFFF?text=C8", 
      category: "Généraliste", 
      isLive: true, 
      signal: 89,
      url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
      tvgId: "c8.fr",
      epgUrl: "https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml"
    }
  ];

  const categories = ["Toutes", "Généraliste", "Cinéma", "Documentaires", "Culture"];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const averageSignal = Math.round(channels.reduce((acc, ch) => acc + ch.signal, 0) / channels.length);

  const handleChannelClick = (channel: any) => {
    setSelectedChannel(channel);
    setShowPlayer(true);
  };

  if (showPlayer && selectedChannel) {
    return (
      <TVPlayer
        channel={{
          id: selectedChannel.id,
          name: selectedChannel.name,
          logo: selectedChannel.logo,
          category: selectedChannel.category,
          url: selectedChannel.url,
          tvgId: selectedChannel.tvgId,
          epgUrl: selectedChannel.epgUrl
        }}
        onBack={() => setShowPlayer(false)}
        channels={channels.map(ch => ({
          id: ch.id,
          name: ch.name,
          logo: ch.logo,
          category: ch.category,
          url: ch.url,
          tvgId: ch.tvgId,
          epgUrl: ch.epgUrl
        }))}
        onChannelChange={(ch) => setSelectedChannel(ch)}
      />
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">TNT (DVB-T2)</h1>
      </div>

      <div className="px-4 py-6">
        {/* Signal Status */}
        <Card className="mb-6 p-4 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Signal className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">État du signal</h3>
                <p className="text-sm opacity-90">Qualité de réception TNT</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paramètres réseau
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{averageSignal}%</div>
              <div className="text-sm opacity-80">Signal moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{channels.length}</div>
              <div className="text-sm opacity-80">Chaînes détectées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">UHF</div>
              <div className="text-sm opacity-80">Bande de fréquence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">HD</div>
              <div className="text-sm opacity-80">Qualité disponible</div>
            </div>
          </div>
        </Card>

        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une chaîne TNT..."
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
              {selectedCategory === "Toutes" ? "Toutes les chaînes TNT" : selectedCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredChannels.length} chaîne{filteredChannels.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredChannels.map((channel) => (
              <Card 
                key={channel.id} 
                className="relative p-4 hover:shadow-card-hover transition-all duration-300 cursor-pointer group"
                onClick={() => handleChannelClick(channel)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-card rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                    <img 
                      src={channel.logo} 
                      alt={channel.name}
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{channel.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{channel.category}</p>
                  
                  <div className="flex items-center gap-1">
                    <Signal className="w-3 h-3" />
                    <span className="text-xs">{channel.signal}%</span>
                    <Badge 
                      variant={channel.signal >= 90 ? "default" : channel.signal >= 80 ? "secondary" : "destructive"}
                      className="text-xs px-1 py-0"
                    >
                      {channel.signal >= 90 ? "Excellent" : channel.signal >= 80 ? "Bon" : "Faible"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DVBT2;