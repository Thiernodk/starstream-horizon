import { useState, useEffect, useCallback } from 'react';

export interface EPGProgram {
  id: string;
  title: string;
  description: string;
  start: string;
  stop: string;
  startTime: Date;
  stopTime: Date;
  category?: string;
}

export interface EPGData {
  channelId: string;
  programs: EPGProgram[];
}

interface UseEPGProps {
  channelTvgId?: string;
  epgUrl?: string;
}

const parseXMLTV = (xmlContent: string): EPGData[] => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlContent, 'application/xml');
    
    const programmes = doc.querySelectorAll('programme');
    const channelMap = new Map<string, EPGProgram[]>();

    programmes.forEach(prog => {
      const channelId = prog.getAttribute('channel');
      if (!channelId) return;

      const start = prog.getAttribute('start');
      const stop = prog.getAttribute('stop');
      if (!start || !stop) return;

      const titleElement = prog.querySelector('title');
      const descElement = prog.querySelector('desc');
      const categoryElement = prog.querySelector('category');

      const program: EPGProgram = {
        id: `${channelId}-${start}`,
        title: titleElement?.textContent?.trim() || 'Programme sans titre',
        description: descElement?.textContent?.trim() || '',
        start,
        stop,
        startTime: parseXMLTVTime(start),
        stopTime: parseXMLTVTime(stop),
        category: categoryElement?.textContent?.trim()
      };

      if (!channelMap.has(channelId)) {
        channelMap.set(channelId, []);
      }
      channelMap.get(channelId)!.push(program);
    });

    const result: EPGData[] = [];
    channelMap.forEach((programs, channelId) => {
      result.push({
        channelId,
        programs: programs.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      });
    });

    return result;
  } catch (error) {
    console.error('Error parsing XMLTV:', error);
    return [];
  }
};

const parseXMLTVTime = (timeStr: string): Date => {
  // XMLTV time format: YYYYMMDDHHmmss +TIMEZONE
  const match = timeStr.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/);
  if (match) {
    const [, year, month, day, hour, minute, second] = match;
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    );
  }
  return new Date();
};

const generateMockEPG = (channelTvgId: string): EPGProgram[] => {
  const now = new Date();
  const programs: EPGProgram[] = [];
  
  for (let i = -2; i < 10; i++) {
    const startTime = new Date(now.getTime() + i * 2 * 60 * 60 * 1000); // 2 hour intervals
    const stopTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
    
    programs.push({
      id: `${channelTvgId}-mock-${i}`,
      title: i === 0 ? 'Programme en cours' : i === 1 ? 'Programme suivant' : `Émission ${Math.abs(i)}`,
      description: i === 0 
        ? 'Description du programme actuellement diffusé sur cette chaîne'
        : i === 1
        ? 'Prochaine émission à suivre sur cette chaîne'
        : `Description de l'émission ${Math.abs(i)}`,
      start: startTime.toISOString(),
      stop: stopTime.toISOString(),
      startTime,
      stopTime,
      category: 'Général'
    });
  }
  
  return programs.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

export const useEPG = ({ channelTvgId, epgUrl }: UseEPGProps) => {
  const [epgData, setEPGData] = useState<EPGProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEPG = useCallback(async () => {
    if (!channelTvgId) {
      setEPGData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build candidate EPG URLs: provided epgUrl first, then fallbacks based on tvgId/country
      const candidates: string[] = [];
      if (epgUrl) candidates.push(epgUrl);

      const country = channelTvgId?.split('.')?.pop()?.toLowerCase();
      const fallbackByCountry: Record<string, string[]> = {
        fr: [
          'https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml',
          'https://iptv-org.github.io/epg/guides/fr/programmes-tele.com.epg.xml',
        ],
      };

      if (country && fallbackByCountry[country]) {
        candidates.push(...fallbackByCountry[country]);
      } else {
        // Generic fallback (France guide has wide coverage and stable hosting)
        candidates.push('https://iptv-org.github.io/epg/guides/fr/programme-tv.net.epg.xml');
      }

      const fetchAndParse = async (url: string) => {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!response.ok) return null;
        const data = await response.json();
        const epgList = parseXMLTV(data.contents);
        return epgList.find(epg => epg.channelId === channelTvgId) || null;
      };

      for (const url of candidates) {
        try {
          const channelEPG = await fetchAndParse(url);
          if (channelEPG && channelEPG.programs.length > 0) {
            setEPGData(channelEPG.programs);
            setLoading(false);
            return;
          }
        } catch {}
      }

      // Fallback to mock data
      console.log(`Using mock EPG data for channel: ${channelTvgId}`);
      setEPGData(generateMockEPG(channelTvgId));
    } catch (err) {
      console.warn('EPG fetch failed, using mock data:', err);
      setEPGData(generateMockEPG(channelTvgId));
      setError('EPG non disponible - données simulées');
    } finally {
      setLoading(false);
    }
  }, [channelTvgId, epgUrl]);

  useEffect(() => {
    fetchEPG();
    
    // Refresh EPG every 30 seconds
    const interval = setInterval(fetchEPG, 30000);
    
    return () => clearInterval(interval);
  }, [fetchEPG]);

  const getCurrentProgram = useCallback(() => {
    const now = new Date();
    return epgData.find(program => 
      now >= program.startTime && now < program.stopTime
    );
  }, [epgData]);

  const getNextProgram = useCallback(() => {
    const now = new Date();
    const upcoming = epgData.filter(program => program.startTime > now);
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [epgData]);

  const getTodayPrograms = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return epgData.filter(program => 
      program.startTime >= today && program.startTime < tomorrow
    );
  }, [epgData]);

  return {
    epgData,
    loading,
    error,
    getCurrentProgram,
    getNextProgram,
    getTodayPrograms,
    refresh: fetchEPG
  };
};