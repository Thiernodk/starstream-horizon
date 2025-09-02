import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw, Square, ArrowLeft } from "lucide-react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { resolveHlsSource } from "@/utils/stream";

interface UnifiedVideoPlayerProps {
  src: string;
  title: string;
  description?: string;
  poster?: string;
  type?: "video" | "hls";
  onBack: () => void;
  metadata?: {
    genre?: string;
    year?: string | number;
    duration?: string;
    rating?: number;
  };
}

const UnifiedVideoPlayer = ({ 
  src, 
  title, 
  description, 
  poster, 
  type = "video", 
  onBack,
  metadata 
}: UnifiedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let cancelled = false;

    const setup = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let source = src;

        if (type === "hls" || /\.(m3u8?|ts)(\?|$)/i.test(src)) {
          source = await resolveHlsSource(src);
        }

        if (cancelled) return;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
        } else if (Hls.isSupported()) {
          hls = new Hls({ 
            enableWorker: true,
            startLevel: -1,
            capLevelToPlayerSize: true,
            maxBufferLength: 30,
            maxMaxBufferLength: 600,
            maxBufferSize: 60 * 1000 * 1000,
          });
          
          hls.loadSource(source);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false);
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS Error:", data);
            if (data.fatal) {
              setError("Erreur de lecture. Veuillez réessayer.");
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
        setError("Impossible de charger le contenu.");
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
  }, [src, type]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

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

  const handleSeek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
  };

  const toggleFullscreen = () => {
    const playerContainer = document.querySelector('.unified-player-container');
    if (!document.fullscreenElement) {
      if (playerContainer) {
        playerContainer.requestFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
      setIsFullscreen(true);
      // Force landscape orientation in fullscreen
      if ('orientation' in screen && 'lock' in (screen as any).orientation) {
        (screen as any).orientation.lock('landscape').catch(() => {});
      }
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className={`unified-player-container ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : 'min-h-screen bg-black'}`}>
      {/* Header - only in portrait mode */}
      {!isFullscreen && (
        <div className="flex items-center gap-4 p-4 bg-black text-white">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold truncate">{title}</h1>
            {metadata && (
              <p className="text-sm text-white/70">
                {metadata.genre} {metadata.year && `• ${metadata.year}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Video Container */}
      <div className={`relative ${isFullscreen ? 'w-full h-full' : 'aspect-video mx-4 rounded-lg overflow-hidden'} bg-black`}>
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          crossOrigin="anonymous"
          muted={isMuted}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Chargement...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={onBack} variant="outline">
                Retour
              </Button>
            </div>
          </div>
        )}

        {/* Fullscreen Controls - YouTube style overlay */}
        {isFullscreen && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80">
            {/* Top overlay */}
            <div className="absolute top-0 left-0 right-0 p-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
              >
                <Minimize className="w-5 h-5" />
              </Button>
            </div>

            {/* Center play button */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  <Play className="w-8 h-8" />
                </Button>
              </div>
            )}

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleSeek(-10)} className="text-white hover:bg-white/20">
                    <RotateCcw className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleSeek(10)} className="text-white hover:bg-white/20">
                    <RotateCw className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </Button>
                  <div className="w-24">
                    <Slider value={volume} onValueChange={handleVolumeChange} max={1} step={0.1} />
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                    <Minimize className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="text-white text-sm">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Info and Controls - Portrait mode only */}
      {!isFullscreen && (
        <div className="text-white p-4 space-y-4">
          {/* Video Info */}
          <div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            {description && (
              <p className="text-white/80 text-sm mb-3">{description}</p>
            )}
            {metadata && (
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                {metadata.genre && <span>{metadata.genre}</span>}
                {metadata.year && <span>• {metadata.year}</span>}
                {metadata.duration && <span>• {metadata.duration}</span>}
                {metadata.rating && <span>• ⭐ {metadata.rating}</span>}
              </div>
            )}
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" onClick={() => handleSeek(-10)} className="text-white hover:bg-white/20">
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={togglePlay} className="text-white hover:bg-white/20">
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSeek(10)} className="text-white hover:bg-white/20">
                <RotateCw className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={restartVideo} className="text-white hover:bg-white/20">
                <Square className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <div className="w-24">
                <Slider value={volume} onValueChange={handleVolumeChange} max={1} step={0.1} />
              </div>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white hover:bg-white/20">
                <Maximize className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedVideoPlayer;