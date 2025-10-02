import { useEffect, useMemo, useState } from "react";
import { Search, Tv as TvIcon, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useM3UParser } from "@/hooks/useM3UParser";
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
  tvgId?: string;
  epgUrl?: string;
};

const TABS = ["Favoris", "Toutes les chaînes", "Sport", "Cinéma", "MOOV vs N.S Stream"] as const;
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
      source: ch.source || "Default",
      tvgId: ch.tvgId,
      epgUrl: ch.epgUrl
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
    } else if (activeTab === "MOOV vs N.S Stream") {
      // Catégorie spéciale - les chaînes ajoutées ici ne font pas partie des catégories normales
      list = list.filter(c => c.category === "MOOV vs N.S Stream");
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

  // Use TV Player when a channel is selected
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
    <div className="min-h-screen bg-background px-8 py-6">
      {/* Top section with title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          TV en Direct
        </h1>
        <p className="text-muted-foreground text-lg">
          Regardez vos chaînes préférées en direct
        </p>
      </div>

      <div className="space-y-8">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-border">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`pb-4 text-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Controls row */}
        <div className="flex gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Rechercher une chaîne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          {/* Source filter */}
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-[220px] h-12">
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
            className="flex items-center gap-2 h-12 px-6"
          >
            <Settings className="w-5 h-5" />
            Sources
          </Button>
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-foreground text-lg">Chargement des chaînes...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/20 text-destructive-foreground p-6 rounded-lg">
            <p className="text-lg">Erreur: {error}</p>
          </div>
        )}

        {/* Channels grid - larger for Smart TV */}
        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6">
          {filtered.map((ch) => (
            <div 
              key={ch.id}
              className="group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-xl transition-all duration-200"
              onClick={() => {
                setSelectedChannel(ch);
                setShowPlayer(true);
              }}
              tabIndex={0}
            >
              <div className="aspect-square bg-card border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-glow hover:scale-105 transition-all duration-200 flex items-center justify-center">
                <img
                  src={ch.logo}
                  alt={ch.name}
                  className="max-w-full max-h-full object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/150x100/1f2937/ffffff?text=${encodeURIComponent(
                      ch.name.slice(0, 3).toUpperCase()
                    )}`;
                  }}
                />
              </div>
              <div className="mt-3 text-center">
                <p className="text-base text-foreground font-semibold truncate">
                  {ch.name}
                </p>
                {ch.category && (
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {ch.category}
                  </p>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="col-span-full text-center py-20">
              <div className="text-muted-foreground">
                <TvIcon className="w-20 h-20 mx-auto mb-6 opacity-50" />
                <p className="text-2xl font-medium mb-3">Aucune chaîne trouvée</p>
                <p className="text-lg">Essayez de modifier votre recherche ou de changer de catégorie</p>
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
