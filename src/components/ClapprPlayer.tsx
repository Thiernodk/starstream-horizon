import { useEffect, useRef, useState } from "react";
import Clappr from "@clappr/player";
import HlsjsPlayback from "@clappr/hlsjs-playback";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings, Cast, RotateCcw, RotateCw, Pause, Play } from "lucide-react";
import { resolveHlsSource } from "@/utils/stream";

interface ClapprPlayerProps {
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
  controls?: boolean;
}

const ClapprPlayer = ({
  src,
  title,
  onBack,
  poster,
  metadata,
  autoplay = false,
  controls = true,
}: ClapprPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const clapprInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState("20:00");
  const [endTime, setEndTime] = useState("20:45");
  const [progress, setProgress] = useState(65);
  const hideControlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const initPlayer = async () => {
      if (!playerRef.current) return;

      try {
        setIsLoading(true);
        
        const resolvedSrc = await resolveHlsSource(src);
        console.log('Initializing Clappr player with:', resolvedSrc);

        if (clapprInstance.current) {
          clapprInstance.current.destroy();
        }

        clapprInstance.current = new Clappr.Player({
          parent: playerRef.current,
          source: resolvedSrc,
          poster: poster,
          autoPlay: autoplay,
          playback: {
            playInline: true,
            crossOrigin: "anonymous",
          },
          plugins: [HlsjsPlayback],
          width: "100%",
          height: "100%",
          hideMediaControl: true,
          mediacontrol: {
            seekbar: "#00d4ff",
            buttons: "#fff",
          },
          hlsjsConfig: {
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            xhrSetup: (xhr: any, url: string) => {
              xhr.withCredentials = false;
            },
          },
        });

        clapprInstance.current.on(Clappr.Events.PLAYER_READY, () => {
          console.log('Clappr player ready');
          setIsLoading(false);
        });

        clapprInstance.current.on(Clappr.Events.PLAYER_ERROR, (error: any) => {
          console.error("Clappr player error:", error);
          setIsLoading(false);
        });

        clapprInstance.current.on(Clappr.Events.PLAYER_PLAY, () => {
          setIsPlaying(true);
        });

        clapprInstance.current.on(Clappr.Events.PLAYER_PAUSE, () => {
          setIsPlaying(false);
        });

      } catch (error) {
        console.error("Failed to initialize player:", error);
        setIsLoading(false);
      }
    };

    initPlayer();

    return () => {
      if (clapprInstance.current) {
        clapprInstance.current.destroy();
        clapprInstance.current = null;
      }
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, [src, poster, autoplay]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    hideControlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const togglePlayPause = () => {
    if (clapprInstance.current) {
      if (isPlaying) {
        clapprInstance.current.pause();
      } else {
        clapprInstance.current.play();
      }
    }
  };

  const seek = (seconds: number) => {
    if (clapprInstance.current) {
      const currentTime = clapprInstance.current.getCurrentTime();
      clapprInstance.current.seek(currentTime + seconds);
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleMouseMove}
    >
      {/* Player Container with gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/30 via-cyan-800/20 to-cyan-900/30">
        <div ref={playerRef} className="w-full h-full" />
      </div>

      {/* Top Bar */}
      <div className={`absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/60 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Cast className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Center Controls */}
      <div className={`absolute inset-0 z-40 flex items-center justify-center transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-12">
          {/* Rewind 10s */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => seek(-10)}
            className="text-white hover:bg-white/20 rounded-full w-14 h-14"
          >
            <RotateCcw className="w-8 h-8" />
          </Button>

          {/* Play/Pause */}
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlayPause}
            className="text-white hover:bg-cyan-500/30 rounded-full w-24 h-24 bg-cyan-500/20 backdrop-blur-sm"
          >
            {isPlaying ? (
              <Pause className="w-12 h-12" />
            ) : (
              <Play className="w-12 h-12 ml-1" />
            )}
          </Button>

          {/* Forward 10s */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => seek(10)}
            className="text-white hover:bg-white/20 rounded-full w-14 h-14"
          >
            <RotateCw className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-white rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-black text-sm font-bold">DIRECT</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 rounded-full"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Program Info Section */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-background border-t border-border">
        <div className="p-4 md:p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {title || metadata?.channelName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{currentTime}</span>
                <span>-</span>
                <span>{endTime}</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="relative w-full h-1 bg-muted rounded-full overflow-hidden mb-3">
            <div 
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {metadata?.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {metadata.description}
            </p>
          )}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default ClapprPlayer;
