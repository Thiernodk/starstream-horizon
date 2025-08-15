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

        // Use a CORS proxy for demo purposes
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(m3uUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error("Failed to fetch M3U playlist");
        }

        const data = await response.json();
        const m3uContent = data.contents;

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
              name: nameMatch ? nameMatch[1].trim() : `Channel ${parsedChannels.length + 1}`,
              logo: logoMatch ? logoMatch[1] : `https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=${nameMatch ? nameMatch[1].charAt(0) : 'TV'}`,
              group: groupMatch ? groupMatch[1] : 'General',
            };
          } else if (line && !line.startsWith('#') && currentChannel.name) {
            // This is the stream URL
            currentChannel.url = line;
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
            name: "France 24",
            logo: "https://via.placeholder.com/48x48/1E40AF/FFFFFF?text=F24",
            url: "https://static.france24.com/live/F24_FR_HI_HLS/live_tv.m3u8",
            group: "News"
          },
          {
            id: "2",
            name: "Euronews",
            logo: "https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=EN",
            url: "https://euronews-euronews-world-1-eu.rakuten.wurl.tv/playlist.m3u8",
            group: "News"
          },
          {
            id: "3",
            name: "TV5 Monde",
            logo: "https://via.placeholder.com/48x48/059669/FFFFFF?text=TV5",
            url: "https://ott.tv5monde.com/Content/HLS/Live/channel(europe)/variant.m3u8",
            group: "General"
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