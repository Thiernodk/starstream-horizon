// Utility functions for EPG data handling

export const formatEPGTime = (date: Date): string => {
  return date.toLocaleTimeString("fr-FR", { 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};

export const formatEPGDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", { 
    weekday: "long", 
    day: "numeric", 
    month: "long" 
  });
};

export const calculateProgress = (start: Date, stop: Date): number => {
  const now = new Date();
  const total = stop.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.max(0, Math.min(100, (elapsed / total) * 100));
};

export const isCurrentProgram = (start: Date, stop: Date): boolean => {
  const now = new Date();
  return start <= now && stop > now;
};

export const createMockEPGUrl = (channelId: string): string => {
  // This would be replaced with actual EPG service URLs
  return `https://api.startimes.com/epg/${channelId}.xml`;
};

export const getEPGServiceUrls = () => {
  return {
    xmltv: "https://iptv-org.github.io/epg/guides/fr/programme-tv.fr.xml",
    startimes: "https://api.startimes.com/epg/",
    custom: "/epg/" // For custom EPG files
  };
};