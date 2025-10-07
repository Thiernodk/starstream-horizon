
/**
 * Proxy a URL through CORS-friendly proxies for streaming
 */
const proxifyUrl = (url: string): string[] => {
  const encoded = encodeURIComponent(url);
  
  // Convert HTTP to HTTPS if on secure page
  const secureUrl = url.replace(/^http:/, 'https:');
  
  return [
    secureUrl, // Try HTTPS version first
    url, // Original URL
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://api.allorigins.win/raw?url=${encoded}`,
    `https://corsproxy.io/?${encoded}`,
  ];
};

/**
 * Resolve a stream URL so that .m3u playlists return a playable stream (prefer .m3u8).
 * Uses simple CORS-friendly fallbacks similar to the M3U parser.
 */
export const resolveHlsSource = async (url: string): Promise<string> => {
  console.log('Resolving stream URL:', url);
  
  // If it's already a direct stream (.m3u8, .ts, .mp4), try to proxify it
  const isDirectStream = /\.(m3u8|ts|mp4)(\?|$)/i.test(url);
  if (isDirectStream) {
    const urls = proxifyUrl(url);
    for (const testUrl of urls) {
      try {
        const res = await fetch(testUrl, { 
          method: 'HEAD',
          mode: 'cors',
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          console.log('Found working stream URL:', testUrl);
          return testUrl;
        }
      } catch (e) {
        continue;
      }
    }
    console.log('Using original URL as fallback');
    return url;
  }

  // If it's a .m3u playlist, parse it
  const isM3U = /\.m3u(\?|$)/i.test(url);
  if (!isM3U) return url;

  const tryFetchText = async (u: string): Promise<string | null> => {
    const testUrls = proxifyUrl(u);
    
    for (const testUrl of testUrls) {
      try {
        const res = await fetch(testUrl, { 
          mode: "cors",
          signal: AbortSignal.timeout(10000)
        });
        if (res.ok) {
          const text = await res.text();
          console.log('Successfully fetched M3U from:', testUrl);
          return text;
        }
      } catch (e) {
        continue;
      }
    }
    return null;
  };

  const content = await tryFetchText(url);
  if (!content) {
    console.log('Failed to fetch M3U, using original URL');
    return url;
  }

  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);

  // Prefer first .m3u8, else first non-comment http(s) line
  const m3u8 = lines.find(l => !l.startsWith("#") && /^https?:\/\//i.test(l) && /\.m3u8(\?|$)/i.test(l));
  if (m3u8) {
    console.log('Found M3U8 stream:', m3u8);
    return m3u8;
  }

  const firstHttp = lines.find(l => !l.startsWith("#") && /^https?:\/\//i.test(l));
  const resolvedUrl = firstHttp || url;
  console.log('Resolved to:', resolvedUrl);
  return resolvedUrl;
};
