import { useState, useEffect, useCallback } from "react";
import { resolveHlsSource } from "@/utils/stream";

interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
  source?: string;
  resolvedUrl?: string;
}

interface CustomSource {
  id: string;
  name: string;
  url: string;
  type: 'M3U' | 'Manual';
}

interface CustomChannel extends Channel {
  sourceId: string;
}

const STORAGE_KEYS = {
  CUSTOM_SOURCES: 'tv-custom-sources',
  CUSTOM_CHANNELS: 'tv-custom-channels'
};

export const useM3UParser = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customSources, setCustomSources] = useState<CustomSource[]>([]);

  // Default playlist URLs
  const defaultPlaylists = [
    { url: "https://iptv-org.github.io/iptv/languages/fra.m3u", name: "Chaînes Françaises" },
    { url: "https://iptv-org.github.io/iptv/categories/sports.m3u", name: "Chaînes Sport" }
  ];

  // Load custom sources from localStorage
  useEffect(() => {
    const savedSources = localStorage.getItem(STORAGE_KEYS.CUSTOM_SOURCES);
    
    if (savedSources) {
      setCustomSources(JSON.parse(savedSources));
    }
  }, []);

  const parseM3U = useCallback(async (url: string, sourceName = 'Default') => {
      try {
        setLoading(true);
        setError(null);

        // Fetch M3U with multiple fallbacks (direct -> r.jina.ai -> allorigins)
        const tryFetchText = async (url: string): Promise<string> => {
          // 1) Direct
          try {
            const res = await fetch(url, { mode: "cors" });
            if (res.ok) return await res.text();
          } catch {}
          // 2) r.jina.ai proxy (CORS-friendly)
          try {
            const res = await fetch(`https://r.jina.ai/http://${url.replace(/^https?:\/\//, "")}`);
            if (res.ok) return await res.text();
          } catch {}
          // 3) allorigins JSON wrapper
          const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
          if (!res.ok) throw new Error("Failed to fetch M3U playlist");
          const data = await res.json();
          return data.contents as string;
        };

        const m3uContent = await tryFetchText(url);

        const lines = m3uContent.split('\n');
        const parsedChannels: Channel[] = [];
        let currentChannel: Partial<Channel> = {};

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();

          if (line.startsWith('#EXTINF:')) {
            // Parse channel info
            const nameMatch = line.match(/,(.+)$/);
            const logoMatch = line.match(/tvg-logo="([^"]+)"/);
            const groupMatch = line.match(/group-title="([^"]+)"/);

            currentChannel = {
              id: `${sourceName}-${parsedChannels.length + 1}`,
              name: nameMatch ? nameMatch[1].trim() : `Chaîne ${parsedChannels.length + 1}`,
              logo: logoMatch ? logoMatch[1] : `https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=${encodeURIComponent(nameMatch ? nameMatch[1].charAt(0) : 'TV')}`,
              group: groupMatch ? groupMatch[1] || 'Général' : 'Général',
              source: sourceName,
            };
          } else if (line && !line.startsWith('#') && (currentChannel as any).name) {
            // This is the stream URL
            (currentChannel as any).url = line;
            
            // Pre-resolve the URL if it's an m3u/m3u8 file
            try {
              if (/\.m3u(\?|$)/i.test(line)) {
                resolveHlsSource(line).then(resolvedUrl => {
                  const channelIndex = parsedChannels.findIndex(ch => ch.url === line);
                  if (channelIndex !== -1) {
                    parsedChannels[channelIndex].resolvedUrl = resolvedUrl;
                  }
                }).catch(err => {
                  console.warn('Failed to resolve URL:', line, err);
                });
              }
            } catch (err) {
              console.warn('Error pre-resolving URL:', line, err);
            }
            
            parsedChannels.push(currentChannel as Channel);
            currentChannel = {};
          }
        }

        return parsedChannels;
      } catch (err) {
        console.error('Error parsing M3U:', err);
        throw err;
      }
    }, []);

  const loadAllChannels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse all default playlists
      const allDefaultChannels: Channel[] = [];
      for (const playlist of defaultPlaylists) {
        try {
          const playlistChannels = await parseM3U(playlist.url, playlist.name);
          allDefaultChannels.push(...playlistChannels);
        } catch (err) {
          console.warn(`Failed to load playlist ${playlist.name}:`, err);
        }
      }
      
      // Parse custom M3U sources
      const customM3UChannels: Channel[] = [];
      for (const source of customSources.filter(s => s.type === 'M3U')) {
        try {
          const sourceChannels = await parseM3U(source.url, source.name);
          customM3UChannels.push(...sourceChannels);
        } catch (err) {
          console.warn(`Failed to load source ${source.name}:`, err);
        }
      }

      const allChannels = [...allDefaultChannels, ...customM3UChannels];
      setChannels(allChannels);

    } catch (err) {
      console.error('Error loading channels:', err);
      setError(err instanceof Error ? err.message : 'Failed to load channels');
      
      // Fallback to demo channels
      setChannels([
        {
          id: "1",
          name: "France 24 (FR)",
          logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/France_24_logo_2013.svg",
          url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
          group: "Infos",
          source: "Demo"
        },
        {
          id: "2",
          name: "Euronews (World)",
          logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Euronews_2016_Logo.svg",
          url: "https://euronews-euronews-world-1-eu.rakuten.wurl.tv/playlist.m3u8",
          group: "Infos",
          source: "Demo"
        },
        {
          id: "3",
          name: "Démo Mux",
          logo: "https://via.placeholder.com/48x48/9333EA/FFFFFF?text=DM",
          url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          group: "Démo",
          source: "Demo"
        },
        {
          id: "4",
          name: "Démo Sintel",
          logo: "https://via.placeholder.com/48x48/059669/FFFFFF?text=DS",
          url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
          group: "Démo",
          source: "Demo"
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [defaultPlaylists, customSources, parseM3U]);

  useEffect(() => {
    loadAllChannels();
  }, [loadAllChannels]);

  const addCustomSource = useCallback((source: Omit<CustomSource, 'id'>) => {
    const newSource = { ...source, id: Date.now().toString() };
    const updatedSources = [...customSources, newSource];
    setCustomSources(updatedSources);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SOURCES, JSON.stringify(updatedSources));
  }, [customSources]);

  const removeCustomSource = useCallback((sourceId: string) => {
    const updatedSources = customSources.filter(s => s.id !== sourceId);
    
    setCustomSources(updatedSources);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_SOURCES, JSON.stringify(updatedSources));
  }, [customSources]);

  return { 
    channels, 
    loading, 
    error,
    customSources,
    addCustomSource,
    removeCustomSource,
    refresh: loadAllChannels
  };
};