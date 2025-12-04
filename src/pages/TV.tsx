import { useEffect, useMemo, useState } from "react";
import { Search, Tv as TvIcon, Settings, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useM3UParser } from "@/hooks/useM3UParser";
import TVPlayer from "@/components/tv/TVPlayer";
import { VODPlayer } from "@/components/tv/VODPlayer";
import { SourcesDialog } from "@/components/tv/SourcesDialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  hasEmbeddedPlayer?: boolean;
};

const TABS = ["Favoris", "Toutes", "Sport", "Cinéma", "ACADEMY TV"] as const;
type TabKey = typeof TABS[number];

const TV = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("Toutes");
  const [selectedChannel, setSelectedChannel] = useState<ChannelItem | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [showSourcesDialog, setShowSourcesDialog] = useState(false);
  const [dbChannels, setDbChannels] = useState<ChannelItem[]>([]);
  const [vodContents, setVodContents] = useState<ChannelItem[]>([]);
  const [dbLoading, setDbLoading] = useState(true);

  const { 
    channels: m3uChannels, 
    loading: m3uLoading, 
    error, 
    customSources,
    addCustomSource,
    removeCustomSource,
    addCustomChannel,
    refresh
  } = useM3UParser("https://iptv-org.github.io/iptv/languages/fra.m3u");

  // Load channels from Supabase database
  useEffect(() => {
    const loadDbChannels = async () => {
      setDbLoading(true);
      const { data } = await supabase
        .from("channels")
        .select("*")
        .order("name");

      if (data) {
        const channelItems: ChannelItem[] = data.map(ch => ({
          id: ch.id,
          name: ch.name,
          logo: ch.logo || "https://via.placeholder.com/48",
          category: ch.category || ch.group_title || "Général",
          isLive: true,
          url: ch.url,
          source: "Admin",
          tvgId: ch.tvg_id || undefined,
          hasEmbeddedPlayer: false
        }));
        setDbChannels(channelItems);
      }
      setDbLoading(false);
    };

    loadDbChannels();

    const channelSub = supabase
      .channel('channels_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, () => {
        loadDbChannels();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, []);

  // Load VOD contents from Supabase
  useEffect(() => {
    const loadVodContents = async () => {
      const { data } = await supabase
        .from("vod_contents")
        .select("*")
        .order("order_position");

      if (data) {
        const vodChannels: ChannelItem[] = data.map(vod => ({
          id: vod.id,
          name: vod.title,
          logo: vod.thumbnail || "https://via.placeholder.com/48",
          category: vod.category,
          isLive: false,
          url: vod.url,
          source: "ACADEMY TV",
          hasEmbeddedPlayer: true
        }));
        setVodContents(vodChannels);
      }
    };

    loadVodContents();

    const vodSub = supabase
      .channel('vod_contents_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vod_contents' }, () => {
        loadVodContents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(vodSub);
    };
  }, []);

  const loading = m3uLoading || dbLoading;

  const channels: ChannelItem[] = useMemo(() => {
    const m3uMappedChannels = m3uChannels.map(ch => ({
      id: ch.id,
      name: ch.name,
      logo: ch.logo,
      category: ch.group || "Général",
      isLive: true,
      url: ch.url,
      source: ch.source || "Default",
      tvgId: ch.tvgId,
      epgUrl: ch.epgUrl,
      hasEmbeddedPlayer: ch.hasEmbeddedPlayer
    }));

    return [...dbChannels, ...m3uMappedChannels, ...vodContents];
  }, [m3uChannels, dbChannels, vodContents]);

  const availableSources = useMemo(() => {
    const sources = new Set(channels.map(ch => ch.source).filter(Boolean));
    return ['all', ...Array.from(sources)];
  }, [channels]);

  const filtered = useMemo(() => {
    let list = channels;

    if (selectedSource !== "all") {
      list = list.filter(c => c.source === selectedSource);
    }

    if (activeTab === "Sport") {
      list = list.filter(c => /sport/i.test(c.category));
    } else if (activeTab === "Cinéma") {
      list = list.filter(c => /(cin[eé]ma|movie|film)/i.test(c.category));
    } else if (activeTab === "Favoris") {
      list = [];
    } else if (activeTab === "ACADEMY TV") {
      list = list.filter(c => c.category === "ACADEMY TV");
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

  const handleAddChannel = (channel: { name: string; url: string; logo: string; group: string; sourceId: string; hasEmbeddedPlayer?: boolean }) => {
    addCustomChannel(channel);
    toast({
      title: channel.hasEmbeddedPlayer ? "Contenu VOD ajouté" : "Chaîne ajoutée",
      description: `${channel.hasEmbeddedPlayer ? "Le contenu" : "La chaîne"} "${channel.name}" a été ${channel.hasEmbeddedPlayer ? "ajouté" : "ajoutée"} avec succès.`,
    });
    setTimeout(() => refresh(), 500);
  };

  useEffect(() => {
    if (!selectedChannel && filtered.length > 0) {
      setSelectedChannel(filtered[0]);
    }
  }, [filtered, selectedChannel]);

  if (showPlayer && selectedChannel) {
    if (selectedChannel.hasEmbeddedPlayer) {
      return (
        <VODPlayer
          content={{
            id: selectedChannel.id,
            name: selectedChannel.name,
            url: selectedChannel.url,
            logo: selectedChannel.logo
          }}
          onBack={() => setShowPlayer(false)}
        />
      );
    }
    
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
    <div className="min-h-screen bg-background px-4 py-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">TV en Direct</h1>
        <p className="text-muted-foreground text-sm">Regardez vos chaînes préférées</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Tabs - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {TABS.map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className="whitespace-nowrap shrink-0"
          >
            {tab}
          </Button>
        ))}
      </div>

      {/* Source filter & Settings */}
      <div className="flex gap-2 mb-4">
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="flex-1 h-9">
            <SelectValue placeholder="Sources" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
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
          size="icon"
          onClick={() => setShowSourcesDialog(true)}
          className="h-9 w-9 shrink-0"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-destructive/20 text-destructive-foreground p-3 rounded-lg text-sm mb-4">
          Erreur: {error}
        </div>
      )}

      {/* Channels grid - mobile optimized */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {filtered.map((ch) => (
          <div 
            key={ch.id}
            className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
            onClick={() => {
              setSelectedChannel(ch);
              setShowPlayer(true);
            }}
            tabIndex={0}
          >
            <div className="aspect-square bg-card border border-border rounded-lg p-2 hover:border-primary hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <img
                src={ch.logo}
                alt={ch.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/80/1f2937/ffffff?text=${encodeURIComponent(
                    ch.name.slice(0, 2).toUpperCase()
                  )}`;
                }}
              />
            </div>
            <p className="text-xs text-foreground font-medium truncate mt-1 text-center">
              {ch.name}
            </p>
          </div>
        ))}

        {filtered.length === 0 && !loading && (
          <div className="col-span-full text-center py-12">
            <TvIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-sm">Aucune chaîne trouvée</p>
          </div>
        )}
      </div>

      {/* Sources Dialog */}
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
