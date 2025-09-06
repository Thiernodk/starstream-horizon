import { useState, useEffect, useCallback } from "react";

export interface EPGProgram {
  id: string;
  title: string;
  description: string;
  start: Date;
  stop: Date;
  category?: string;
  channelId: string;
}

export interface EPGChannel {
  id: string;
  name: string;
  programs: EPGProgram[];
  epgUrl?: string;
}

interface CurrentProgram {
  current: EPGProgram | null;
  next: EPGProgram | null;
}

export const useEPG = (channelId: string, epgUrl?: string) => {
  const [programs, setPrograms] = useState<EPGProgram[]>([]);
  const [currentProgram, setCurrentProgram] = useState<CurrentProgram>({ current: null, next: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parse XMLTV format
  const parseXMLTV = useCallback((xmlContent: string, channelId: string): EPGProgram[] => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
    const programmes = xmlDoc.querySelectorAll('programme');
    
    const parsedPrograms: EPGProgram[] = [];
    
    programmes.forEach((programme, index) => {
      const channel = programme.getAttribute('channel');
      if (channel === channelId || !channelId) {
        const start = programme.getAttribute('start');
        const stop = programme.getAttribute('stop');
        const title = programme.querySelector('title')?.textContent || '';
        const desc = programme.querySelector('desc')?.textContent || '';
        const category = programme.querySelector('category')?.textContent || '';
        
        if (start && stop) {
          parsedPrograms.push({
            id: `${channelId}-${index}`,
            title,
            description: desc,
            start: parseXMLTVDate(start),
            stop: parseXMLTVDate(stop),
            category,
            channelId: channelId
          });
        }
      }
    });
    
    return parsedPrograms.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, []);

  // Parse JSON EPG format
  const parseJSONEPG = useCallback((jsonContent: string, channelId: string): EPGProgram[] => {
    try {
      const data = JSON.parse(jsonContent);
      const channelData = data.channels?.[channelId] || data.programs || [];
      
      return channelData.map((program: any, index: number) => ({
        id: program.id || `${channelId}-${index}`,
        title: program.title || '',
        description: program.description || program.desc || '',
        start: new Date(program.start),
        stop: new Date(program.stop),
        category: program.category || '',
        channelId: channelId
      }));
    } catch (e) {
      throw new Error('Invalid JSON EPG format');
    }
  }, []);

  // Parse XMLTV date format (YYYYMMDDHHmmss +ZZZZ)
  const parseXMLTVDate = (dateStr: string): Date => {
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.substring(6, 8));
    const hour = parseInt(dateStr.substring(8, 10));
    const minute = parseInt(dateStr.substring(10, 12));
    const second = parseInt(dateStr.substring(12, 14));
    
    return new Date(year, month, day, hour, minute, second);
  };

  // Fetch EPG data
  const fetchEPG = useCallback(async (url: string) => {
    if (!url) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const content = await response.text();
      let parsedPrograms: EPGProgram[] = [];
      
      // Detect format and parse accordingly
      if (content.trim().startsWith('<?xml') || content.includes('<tv>')) {
        parsedPrograms = parseXMLTV(content, channelId);
      } else {
        parsedPrograms = parseJSONEPG(content, channelId);
      }
      
      setPrograms(parsedPrograms);
      updateCurrentProgram(parsedPrograms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch EPG');
      console.error('EPG fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId, parseXMLTV, parseJSONEPG]);

  // Update current and next program based on current time
  const updateCurrentProgram = useCallback((programList: EPGProgram[] = programs) => {
    const now = new Date();
    
    const current = programList.find(program => 
      program.start <= now && program.stop > now
    );
    
    const next = programList.find(program => 
      program.start > now
    );
    
    setCurrentProgram({ current: current || null, next: next || null });
  }, [programs]);

  // Generate mock EPG data if no EPG URL is provided
  const generateMockEPG = useCallback((channelId: string) => {
    const now = new Date();
    const mockPrograms: EPGProgram[] = [];
    
    for (let i = -2; i < 10; i++) {
      const startTime = new Date(now.getTime() + (i * 2 * 60 * 60 * 1000)); // 2 hour intervals
      const endTime = new Date(startTime.getTime() + (2 * 60 * 60 * 1000));
      
      mockPrograms.push({
        id: `mock-${channelId}-${i}`,
        title: i === 0 ? "Programme en cours" : i === 1 ? "Programme suivant" : `Programme ${i > 0 ? i + 1 : Math.abs(i)}`,
        description: `Description du programme diffusé sur cette chaîne. Contenu de qualité et divertissement garanti.`,
        start: startTime,
        stop: endTime,
        category: i % 3 === 0 ? "Information" : i % 3 === 1 ? "Divertissement" : "Cinéma",
        channelId
      });
    }
    
    setPrograms(mockPrograms);
    updateCurrentProgram(mockPrograms);
  }, [updateCurrentProgram]);

  // Load EPG data when channel or EPG URL changes
  useEffect(() => {
    if (epgUrl) {
      fetchEPG(epgUrl);
    } else {
      generateMockEPG(channelId);
    }
  }, [channelId, epgUrl, fetchEPG, generateMockEPG]);

  // Update current program every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentProgram();
    }, 30000);

    return () => clearInterval(interval);
  }, [updateCurrentProgram]);

  const refreshEPG = useCallback(() => {
    if (epgUrl) {
      fetchEPG(epgUrl);
    } else {
      generateMockEPG(channelId);
    }
  }, [epgUrl, fetchEPG, generateMockEPG, channelId]);

  return {
    programs,
    currentProgram,
    loading,
    error,
    refreshEPG
  };
};