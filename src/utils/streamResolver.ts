import { resolveHlsSource } from "./stream";

/**
 * Enhanced stream resolver that ensures all .m3u/.m3u8 channels work properly
 */
export class StreamResolver {
  private static cache = new Map<string, string>();
  private static resolving = new Set<string>();

  /**
   * Get the best playable URL for a channel
   */
  static async getPlayableUrl(originalUrl: string, resolvedUrl?: string): Promise<string> {
    // If we already have a resolved URL, use it
    if (resolvedUrl) {
      return resolvedUrl;
    }

    // Check cache first
    if (this.cache.has(originalUrl)) {
      return this.cache.get(originalUrl)!;
    }

    // Avoid concurrent resolution of the same URL
    if (this.resolving.has(originalUrl)) {
      return originalUrl; // Return original while resolving
    }

    try {
      this.resolving.add(originalUrl);
      
      // Only resolve if it's an m3u/m3u8 URL
      if (/\.m3u(\?|$)/i.test(originalUrl)) {
        const resolved = await resolveHlsSource(originalUrl);
        this.cache.set(originalUrl, resolved);
        return resolved;
      }
      
      // For direct streams, return as-is
      return originalUrl;
      
    } catch (error) {
      console.warn('Failed to resolve stream URL:', originalUrl, error);
      return originalUrl; // Fallback to original URL
    } finally {
      this.resolving.delete(originalUrl);
    }
  }

  /**
   * Clear the cache (useful for refreshing sources)
   */
  static clearCache() {
    this.cache.clear();
  }

  /**
   * Pre-resolve URLs for better performance
   */
  static async preResolveUrls(urls: string[]): Promise<void> {
    const promises = urls
      .filter(url => /\.m3u(\?|$)/i.test(url))
      .map(url => this.getPlayableUrl(url));
      
    await Promise.allSettled(promises);
  }
}