import { useEffect, useMemo, useState } from "react";
import { Search, Cast, User, Tv as TvIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/VideoPlayer";
import { useM3UParser } from "@/hooks/useM3UParser";
import channelsBg from "@/assets/channels-bg.jpg";
import ChannelListItem from "@/components/tv/ChannelListItem";

type ChannelItem = {
  id: string;
  name: string;
  logo: string;
  category: string;
  isLive: boolean;
  url: string;
};

const TABS = ["Favoris", "Toutes les chaînes", "Sport", "Cinéma"] as const;
type TabKey = typeof TABS[number];

const TV = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Toutes les chaînes");
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem | null>(null);

  const { channels: m3uChannels, loading, error } = useM3UParser("https://iptv-org.github.io/iptv/languages/fra.m3u");

  const channels: ChannelItem[] = useMemo(() => {
    return m3uChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      logo: ch.logo,
      category: ch.group || "Général",
      isLive: true,
      url: ch.url
    }));
  }, [m3uChannels]);

  const filtered = useMemo(() => {
    let list = channels;

    if (activeTab === "Sport") {
      list = list.filter(c => /sport/i.test(c.category));
    } else if (activeTab === "Cinéma") {
      list = list.filter(c => /(cin[eé]ma|movie|film)/i.test(c.category));
    } else if (activeTab === "Favoris") {
      // No favorites system yet – keep it simple
      list = [];
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }

    return list;
  }, [channels, activeTab, searchQuery]);

  useEffect(() => {
    if (!selectedChannel && filtered.length > 0) {
      setSelectedChannel(filtered[0]);
    }
  }, [filtered, selectedChannel]);

  return (
    <div className="min-h-screen">
      {/* Top header with background and title */}
      <div className="relative h-24 overflow-hidden">
        <img src={channelsBg} alt="Channels background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">EN DIRECT</h1>
          <div className="flex items-center gap-2 text-white">
            <Cast className="w-5 h-5 opacity-90" />
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Tabs like in the screenshot */}
        <div className="flex gap-4 overflow-x-auto pb-1">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`pb-2 text-sm md:text-base whitespace-nowrap ${
                activeTab === tab ? "text-primary font-medium border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Rechercher une chaîne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-white">Chargement des chaînes...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/20 text-destructive-foreground p-4 rounded-lg">
            <p>Erreur: {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Left column: list of channel thumbnails */}
          <div className="md:col-span-2 space-y-3 md:max-h-[70vh] md:overflow-y-auto pr-1">
            {filtered.map((ch) => (
              <div key={ch.id} className="group">
                <ChannelListItem
                  name={ch.name}
                  logo={ch.logo}
                  active={selectedChannel?.id === ch.id}
                  onClick={() => setSelectedChannel(ch)}
                />
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-sm text-muted-foreground py-8 text-center">
                Aucune chaîne à afficher.
              </div>
            )}
          </div>

          {/* Right column: details + player */}
          <div className="md:col-span-3">
            {selectedChannel ? (
              <div className="space-y-3">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                  <VideoPlayer
                    src={selectedChannel.url}
                    title={selectedChannel.name}
                    type="hls"
                    className="w-full h-full"
                  />
                </div>

                <div className="p-3 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <TvIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {selectedChannel.category}
                    </span>
                    {selectedChannel.isLive && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-destructive text-destructive-foreground">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h2 className="text-base md:text-lg font-semibold">{selectedChannel.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Diffusion en direct — profitez de la chaîne sélectionnée.
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted/30 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Sélectionnez une chaîne dans la liste</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TV;
