import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, RotateCcw, RotateCw, Pause, Play, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface HLSPlayerProps {
  src: string;
  title?: string;
  onBack?: () => void;
  poster?: string;
  metadata?: {
    channelName?: string;
    channelLogo?: string;
    category?: string;
    description?: string;
  };
  autoplay?: boolean;
}

const HLSPlayer = ({
  src,
  title,
  onBack,
  poster,
  metadata,
  autoplay = true,
}: HLSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initPlayer = async () => {
      setIsLoading(true);
      setError(null);

      // Destroy previous instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      // Check if it's an HLS stream
      const isHlsStream = src.includes('.m3u8') || src.includes('.m3u');

      if (isHlsStream && Hls.isSupported()) {
        // Use HLS.js for browsers that don't support HLS natively
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          startLevel: -1, // Auto quality
          capLevelToPlayerSize: true,
          xhrSetup: (xhr) => {
            xhr.withCredentials = false;
          },
        });

        hlsRef.current = hls;

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          console.log('HLS Media attached');
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS Manifest parsed');
          setIsLoading(false);
          if (autoplay) {
            video.play().catch(console.error);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                setError('Erreur de lecture du flux');
                hls.destroy();
                break;
            }
          }
        });

        hls.loadSource(src);
        hls.attachMedia(video);

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari, iOS)
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          if (autoplay) {
            video.play().catch(console.error);
          }
        });
      } else {
        // Direct video source (MP4, etc.)
        video.src = src;
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          if (autoplay) {
            video.play().catch(console.error);
          }
        });
      }
    };

    initPlayer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [src, autoplay]);

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setError('Erreur de lecture');
      setIsLoading(false);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, []);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleInteraction = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(console.error);
    }
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, video.currentTime + seconds);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const newVolume = value[0];
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isMuted) {
      video.volume = volume || 1;
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen bg-black overflow-hidden touch-none"
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        playsInline
        webkit-playsinline="true"
        poster={poster}
        preload="auto"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60" />

      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center justify-between">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full w-12 h-12"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
          )}
          <div className="flex-1 text-center">
            <h3 className="text-white font-semibold text-lg truncate px-4">
              {title || metadata?.channelName}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20 rounded-full w-12 h-12"
          >
            {isFullscreen ? <Minimize className="h-6 w-6" /> : <Maximize className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Center Controls */}
      <div className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-8 md:gap-12">
          {/* Rewind 10s */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => seek(-10)}
            className="text-white hover:bg-white/20 rounded-full w-14 h-14 md:w-16 md:h-16 active:scale-95 transition-transform"
          >
            <RotateCcw className="w-7 h-7 md:w-8 md:h-8" />
          </Button>

          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="text-white hover:bg-primary/40 rounded-full w-20 h-20 md:w-24 md:h-24 bg-primary/30 backdrop-blur-sm active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-10 h-10 md:w-12 md:h-12" />
            ) : (
              <Play className="w-10 h-10 md:w-12 md:h-12 ml-1" />
            )}
          </Button>

          {/* Forward 10s */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => seek(10)}
            className="text-white hover:bg-white/20 rounded-full w-14 h-14 md:w-16 md:h-16 active:scale-95 transition-transform"
          >
            <RotateCw className="w-7 h-7 md:w-8 md:h-8" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="p-4 pb-6">
          {/* Live Badge & Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-black text-sm font-bold">DIRECT</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Volume Control - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 rounded-full w-10 h-10"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-24"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full w-10 h-10"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Channel Info */}
          {metadata && (
            <div className="flex items-center gap-3">
              {metadata.channelLogo && (
                <img 
                  src={metadata.channelLogo} 
                  alt={metadata.channelName} 
                  className="w-10 h-10 rounded-lg object-contain bg-white/10"
                />
              )}
              <div>
                <p className="text-white font-medium">{metadata.channelName}</p>
                {metadata.category && (
                  <p className="text-white/70 text-sm">{metadata.category}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-60">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-white/80 text-sm">Chargement...</p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-60">
          <div className="text-center p-6">
            <p className="text-red-400 text-lg mb-4">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-primary hover:bg-primary/80"
            >
              Réessayer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HLSPlayer;
