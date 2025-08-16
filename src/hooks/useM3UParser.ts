import { useState, useEffect } from "react";

interface Channel {
  id: string;
  name: string;
  logo: string;
  url: string;
  group: string;
}

export const useM3UParser = (m3uUrl: string) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const parseM3U = async () => {
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

        const m3uContent = await tryFetchText(m3uUrl);

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
              id: `channel-${parsedChannels.length + 1}`,
              name: nameMatch ? nameMatch[1].trim() : `Chaîne ${parsedChannels.length + 1}`,
              logo: logoMatch ? logoMatch[1] : `https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=${encodeURIComponent(nameMatch ? nameMatch[1].charAt(0) : 'TV')}`,
              group: groupMatch ? groupMatch[1] || 'Général' : 'Général',
            };
          } else if (line && !line.startsWith('#') && (currentChannel as any).name) {
            // This is the stream URL
            (currentChannel as any).url = line;
            parsedChannels.push(currentChannel as Channel);
            currentChannel = {};
          }
        }

        setChannels(parsedChannels);
      } catch (err) {
        console.error('Error parsing M3U:', err);
        setError(err instanceof Error ? err.message : 'Failed to parse M3U playlist');
        
        // Fallback to demo channels
        setChannels([
          {
            id: "1",
            name: "France 24 (FR)",
            logo: "https://upload.wikimedia.org/wikipedia/commons/6/65/France_24_logo_2013.svg",
            url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
            group: "Infos"
          },
          {
            id: "2",
            name: "Euronews (World)",
            logo: "https://upload.wikimedia.org/wikipedia/commons/7/75/Euronews_2016_Logo.svg",
            url: "https://euronews-euronews-world-1-eu.rakuten.wurl.tv/playlist.m3u8",
            group: "Infos"
          },
          {
            id: "3",
            name: "Démo Mux",
            logo: "https://via.placeholder.com/48x48/9333EA/FFFFFF?text=DM",
            url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
            group: "Démo"
          },
          {
            id: "4",
            name: "Démo Sintel",
            logo: "https://via.placeholder.com/48x48/059669/FFFFFF?text=DS",
            url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
            group: "Démo"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    parseM3U();
  }, [m3uUrl]);

  return { channels, loading, error };
};