
/**
 * Resolve a stream URL so that .m3u playlists return a playable stream (prefer .m3u8).
 * Uses simple CORS-friendly fallbacks similar to the M3U parser.
 */
export const resolveHlsSource = async (url: string): Promise<string> => {
  const isM3U = /\.m3u(\?|$)/i.test(url);
  if (!isM3U) return url;

  const tryFetchText = async (u: string): Promise<string | null> => {
    // 1) Direct
    try {
      const res = await fetch(u, { mode: "cors" });
      if (res.ok) return await res.text();
    } catch {}
    // 2) r.jina.ai proxy
    try {
      const res = await fetch(`https://r.jina.ai/http/${u.replace(/^https?:\/\//, "")}`);
      if (res.ok) return await res.text();
    } catch {}
    // 3) allorigins wrapper
    try {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(u)}`);
      if (res.ok) {
        const data = await res.json();
        return data.contents as string;
      }
    } catch {}
    return null;
  };

  const content = await tryFetchText(url);
  if (!content) return url;

  const lines = content.split("\n").map(l => l.trim()).filter(Boolean);

  // Prefer first .m3u8, else first non-comment http(s) line
  const m3u8 = lines.find(l => !l.startsWith("#") && /^https?:\/\//i.test(l) && /\.m3u8(\?|$)/i.test(l));
  if (m3u8) return m3u8;

  const firstHttp = lines.find(l => !l.startsWith("#") && /^https?:\/\//i.test(l));
  return firstHttp || url;
};
