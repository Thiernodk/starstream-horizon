import { useEffect, useMemo, useState } from "react";
import { Search, Tv as TvIcon, Settings, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useM3UParser } from "@/hooks/useM3UParser";
import channelsBg from "@/assets/channels-bg.jpg";
import ChannelListItem from "@/components/tv/ChannelListItem";
import TVPlayer from "@/components/tv/TVPlayer";
import { SourcesDialog } from "@/components/tv/SourcesDialog";
import { toast } from "@/hooks/use-toast";

type ChannelItem = {
  id: string;
  name: string;
  logo: string;
  category: string;
  isLive: boolean;
  url: string;
  source?: string;
};

const TABS = ["Favoris", "Toutes les chaînes", "Sport", "Cinéma", "MOOV vs StarTimes N.S"] as const;
type TabKey = typeof TABS[number];

const TV = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Toutes les chaînes");
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [showSourcesDialog, setShowSourcesDialog] = useState(false);

  const { 
    channels: m3uChannels, 
    loading, 
    error, 
    customSources,
    addCustomSource,
    removeCustomSource,
    addCustomChannel,
    refresh
  } = useM3UParser("https://iptv-org.github.io/iptv/languages/fra.m3u");

  const channels: ChannelItem[] = useMemo(() => {
    return m3uChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      logo: ch.logo,
      category: ch.group || "Général",
      isLive: true,
      url: ch.url,
      source: ch.source || "Default"
    }));
  }, [m3uChannels]);

  // Get unique sources for filter
  const availableSources = useMemo(() => {
    const sources = new Set(channels.map(ch => ch.source).filter(Boolean));
    return ['all', ...Array.from(sources)];
  }, [channels]);

  const filtered = useMemo(() => {
    let list = channels;

    // Filter by source
    if (selectedSource !== "all") {
      list = list.filter(c => c.source === selectedSource);
    }

    if (activeTab === "Sport") {
      list = list.filter(c => /sport/i.test(c.category));
    } else if (activeTab === "Cinéma") {
      list = list.filter(c => /(cin[eé]ma|movie|film)/i.test(c.category));
    } else if (activeTab === "Favoris") {
      // No favorites system yet – keep it simple
      list = [];
    } else if (activeTab === "MOOV vs StarTimes N.S") {
      // Catégorie spéciale - les chaînes ajoutées ici ne font pas partie des catégories normales
      list = list.filter(c => c.category === "MOOV vs StarTimes N.S");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
    }

    return list;
  }, [channels, activeTab, searchQuery, selectedSource]);

  const handleAddSource = (source: { name: string; url: string; type: 'M3U' }) => {
    addCustomSource(source);
    toast({
      title: "Source ajoutée",
      description: `La source "${source.name}" a été ajoutée avec succès.`,
    });
    // Refresh channels after adding new source
    setTimeout(() => refresh(), 500);
  };

  const handleRemoveSource = (sourceId: string) => {
    const source = customSources.find(s => s.id === sourceId);
    removeCustomSource(sourceId);
    toast({
      title: "Source supprimée",
      description: `La source "${source?.name}" a été supprimée.`,
    });
  };

  const handleAddChannel = (channel: { name: string; url: string; logo: string; group: string; sourceId: string }) => {
    addCustomChannel(channel);
    toast({
      title: "Chaîne ajoutée",
      description: `La chaîne "${channel.name}" a été ajoutée avec succès.`,
    });
    // Refresh channels after adding new channel
    setTimeout(() => refresh(), 500);
  };

  useEffect(() => {
    if (!selectedChannel && filtered.length > 0) {
      setSelectedChannel(filtered[0]);
    }
  }, [filtered, selectedChannel]);

  // Use TV Player when a channel is selected - Molotov style
  if (showPlayer && selectedChannel) {
    return (
      <TVPlayer
        channel={selectedChannel}
        onBack={() => setShowPlayer(false)}
        channels={channels}
        onChannelChange={(ch) => setSelectedChannel(ch)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top header with background and title */}
      <div className="relative h-24 overflow-hidden">
        <img src={channelsBg} alt="Channels background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 flex items-center px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            EN DIRECT
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Tabs like in the screenshot */}
        <div className="flex gap-6 overflow-x-auto pb-1">
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

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une chaîne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Source filter */}
          <div className="flex gap-2">
            <Select value={selectedSource} onValueChange={setSelectedSource}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Toutes les sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les sources</SelectItem>
                {availableSources.filter(s => s !== 'all').map(source => (
                  <SelectItem key={source} value={source}>
                    {source}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowSourcesDialog(true)}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Sources
            </Button>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-foreground">Chargement des chaînes...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/20 text-destructive-foreground p-4 rounded-lg">
            <p>Erreur: {error}</p>
          </div>
        )}

        {/* Section title */}
        <div className="pt-4">
          <h2 className="text-foreground text-xl font-medium mb-6">
            {activeTab}
          </h2>
        </div>

        {/* Channels grid view - like the image */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((ch) => (
            <div 
              key={ch.id}
              className="group cursor-pointer"
              onClick={() => {
                setSelectedChannel(ch);
                setShowPlayer(true);
              }}
            >
              <div className="aspect-square bg-card border border-border rounded-lg p-4 hover:bg-accent transition-colors duration-200 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/120x80/1f2937/ffffff?text=${encodeURIComponent(
                        ch.name.slice(0, 3).toUpperCase()
                      )}`;
                    }}
                  />
                </div>
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm text-foreground font-medium truncate">
                  {ch.name}
                </p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                <TvIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Aucune chaîne trouvée</p>
                <p className="text-sm">Essayez de modifier votre recherche ou de changer de catégorie</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sources management dialog */}
      <SourcesDialog
        open={showSourcesDialog}
        onOpenChange={setShowSourcesDialog}
        customSources={customSources}
        onAddSource={handleAddSource}
        onRemoveSource={handleRemoveSource}
        onAddChannel={handleAddChannel}
      />
    </div>
  );
};

export default TV;
