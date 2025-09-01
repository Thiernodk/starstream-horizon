import { useEffect, useRef, useState } from "react";
import { Settings, Zap, Cast, Clock, Volume2, VolumeX, Maximize, Minimize, Pause, Play, RotateCcw, RotateCw, Square, Mic, Subtitles, Video, List, PictureInPicture2, ZoomIn } from "lucide-react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { StreamResolver } from "@/utils/streamResolver";
import TVPlayerOverlay from "./TVPlayerOverlay";
import TVPlayerControls from "./TVPlayerControls";
import TVPlayerSettings from "./TVPlayerSettings";
import TVZapList from "./TVZapList";
import TVEPGOverlay from "./TVEPGOverlay";

interface TVPlayerProps {
  channel: {
    id: string;
    name: string;
    logo: string;
    category: string;
    url: string;
    resolvedUrl?: string;
  };
  onBack: () => void;
  channels: Array<{
    id: string;
    name: string;
    logo: string;
    category: string;
    url: string;
  }>;
  onChannelChange: (channel: any) => void;
}

const TVPlayer = ({ channel, onBack, channels, onChannelChange }: TVPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showZapList, setShowZapList] = useState(false);
  const [showEPG, setShowEPG] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState("auto");
  const [audioTrack, setAudioTrack] = useState(0);
  const [subtitles, setSubtitles] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPiP, setIsPiP] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  let controlsTimeout = useRef<NodeJS.Timeout>();

  // Mock current program data
  const currentProgram = {
    title: "Programme en cours",
    description: "Description du programme actuellement diffusé sur cette chaîne",
    startTime: "20:00",
    endTime: "22:00",
    progress: 45 // percentage
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let cancelled = false;

    const setup = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Use the enhanced stream resolver
        const source = await StreamResolver.getPlayableUrl(channel.url, channel.resolvedUrl);

        if (cancelled) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (Hls.isSupported()) {
          hls = new Hls({ 
            enableWorker: true,
            startLevel: -1, // Auto quality
            capLevelToPlayerSize: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            maxBufferSize: 60 * 1000 * 1000,
          });
          
          hls.loadSource(source);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
            video.play().catch(err => {
              console.warn("Autoplay failed:", err);
              setIsLoading(false);
            });
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error:", data);
            if (data.fatal) {
              setError("Erreur de diffusion. Veuillez réessayer.");
              setIsLoading(false);
            }
          });
        } else {
          video.src = source;
          setIsLoading(false);
        }

        const updateTime = () => setCurrentTime(video.currentTime);
        const updateDuration = () => setDuration(video.duration);
        const handleLoadStart = () => setIsLoading(true);
        const handleCanPlay = () => setIsLoading(false);

        video.addEventListener("timeupdate", updateTime);
        video.addEventListener("loadedmetadata", updateDuration);
        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("play", () => setIsPlaying(true));
        video.addEventListener("pause", () => setIsPlaying(false));

        return () => {
          video.removeEventListener("timeupdate", updateTime);
          video.removeEventListener("loadedmetadata", updateDuration);
          video.removeEventListener("loadstart", handleLoadStart);
          video.removeEventListener("canplay", handleCanPlay);
          video.removeEventListener("play", () => setIsPlaying(true));
          video.removeEventListener("pause", () => setIsPlaying(false));
        };
      } catch (err) {
        console.error("Setup error:", err);
        setError("Impossible de charger la chaîne.");
        setIsLoading(false);
      }
    };

    const cleanup = setup();

    return () => {
      cancelled = true;
      if (hls) {
        hls.destroy();
      }
      cleanup?.then(dispose => dispose?.());
    };
  }, [channel.url]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls]);

  // Show controls on mouse move
  const handleMouseMove = () => {
    setShowControls(true);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0];
    video.volume = newVolume;
    setVolume([newVolume]);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current as any;
    if (!video) return;
    try {
      // @ts-ignore
      if (!document.pictureInPictureElement) {
        await video.requestPictureInPicture?.();
        setIsPiP(true);
      } else {
        await (document as any).exitPictureInPicture?.();
        setIsPiP(false);
      }
    } catch (e) {
      console.warn("PiP error:", e);
    }
  };

  const handleSeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime + seconds);
  };

  const restartProgram = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("fr-FR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const handleZoom = () => {
    setZoomLevel(prev => {
      const levels = [1, 1.25, 1.5, 2];
      const currentIndex = levels.indexOf(prev);
      const nextIndex = (currentIndex + 1) % levels.length;
      return levels[nextIndex];
    });
  };

  return (
    <>
      <div 
        className={`relative w-full bg-black overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-screen' : 'h-[60vh] max-w-md mx-auto mt-4 rounded-lg'
        }`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          muted={isMuted}
          style={{ transform: `scale(${zoomLevel})` }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Chargement de {channel.name}...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={onBack} variant="outline">
                Retour aux chaînes
              </Button>
            </div>
          </div>
        )}

        {/* TV Player Overlay - Fullscreen only */}
        {isFullscreen && (
          <TVPlayerOverlay
            channel={channel}
            currentProgram={currentProgram}
            currentTime={getCurrentTime()}
            showControls={showControls}
          />
        )}

        {/* Controls - Fullscreen overlay */}
        {isFullscreen && (
          <TVPlayerControls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            currentTime={currentTime}
            duration={duration}
            showControls={showControls}
            isFullscreen={isFullscreen}
            onTogglePlay={togglePlay}
            onToggleMute={toggleMute}
            onVolumeChange={handleVolumeChange}
            onToggleFullscreen={toggleFullscreen}
            onSeek={handleSeek}
            onRestart={restartProgram}
            onShowSettings={() => setShowSettings(true)}
            onShowZap={() => setShowZapList(true)}
            onShowEPG={() => setShowEPG(true)}
            quality={quality}
            audioTrack={audioTrack}
            subtitles={subtitles}
          />
        )}

        {/* Settings Panel */}
        {showSettings && (
          <TVPlayerSettings
            onClose={() => setShowSettings(false)}
            quality={quality}
            onQualityChange={setQuality}
            audioTrack={audioTrack}
            onAudioTrackChange={setAudioTrack}
            subtitles={subtitles}
            onSubtitlesChange={setSubtitles}
          />
        )}

        {/* Zap List */}
        {showZapList && (
          <TVZapList
            channels={channels}
            currentChannel={channel}
            onChannelSelect={(ch) => {
              onChannelChange(ch);
              setShowZapList(false);
            }}
            onClose={() => setShowZapList(false)}
          />
        )}

        {/* EPG Overlay */}
        {showEPG && (
          <TVEPGOverlay
            channel={channel}
            onClose={() => setShowEPG(false)}
          />
        )}
      </div>

      {/* Bottom info + controls (portrait mode) */}
      {!isFullscreen && (
        <div className="max-w-md mx-auto px-4 py-3 space-y-3">
          {/* Info */}
          <div className="flex items-start gap-3">
            <img
              src={channel.logo}
              alt={channel.name}
              className="w-10 h-10 rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <div className="flex-1">
              <div className="text-base font-semibold">{currentProgram.title}</div>
              <div className="text-sm text-muted-foreground">{currentProgram.description}</div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span>{currentProgram.startTime} - {currentProgram.endTime}</span>
                <span className="px-2 py-0.5 bg-destructive rounded-full text-destructive-foreground">LIVE</span>
              </div>
              <div className="mt-2 h-1 w-full bg-muted rounded-full">
                <div className="h-1 bg-primary rounded-full" style={{ width: `${currentProgram.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => handleSeek(-10)} aria-label="-10s">
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlay} aria-label="Lecture/Pause">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSeek(10)} aria-label="+10s">
                <RotateCw className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={restartProgram} aria-label="Recommencer">
                <Square className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Muet">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-24">
                <Slider value={volume} onValueChange={handleVolumeChange} max={1} step={0.1} />
              </div>
            </div>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowEPG(true)}>
              <Clock className="w-4 h-4 mr-2" />
              Programme TV
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowZapList(true)}>
              <List className="w-4 h-4 mr-2" />
              Zap
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Video className="w-4 h-4 mr-2" />
              Qualité
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Mic className="w-4 h-4 mr-2" />
              Audio
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
              <Subtitles className="w-4 h-4 mr-2" />
              Sous-titres
            </Button>
            <Button variant="outline" size="sm" onClick={togglePiP}>
              <PictureInPicture2 className="w-4 h-4 mr-2" />
              PiP
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              <Maximize className="w-4 h-4 mr-2" />
              Plein écran
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoom}>
              <ZoomIn className="w-4 h-4 mr-2" />
              Zoom {Math.round(zoomLevel * 100)}%
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default TVPlayer;