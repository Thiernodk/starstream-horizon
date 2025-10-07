import { useEffect, useRef, useState } from "react";
import Clappr from "@clappr/player";
import HlsjsPlayback from "@clappr/hlsjs-playback";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Info } from "lucide-react";
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
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initPlayer = async () => {
      if (!playerRef.current) return;

      try {
        setIsLoading(true);
        
        // Resolve HLS source if needed
        const resolvedSrc = await resolveHlsSource(src);
        console.log('Initializing Clappr player with:', resolvedSrc);

        // Destroy existing player
        if (clapprInstance.current) {
          clapprInstance.current.destroy();
        }

        // Create new Clappr player
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
          mediacontrol: {
            seekbar: "#00d4ff",
            buttons: "#fff",
          },
          hlsjsConfig: {
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            xhrSetup: (xhr: any, url: string) => {
              // Add CORS headers
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
          console.log('Playback started');
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
    };
  }, [src, poster, autoplay]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
            )}
            {metadata?.channelLogo && (
              <img
                src={metadata.channelLogo}
                alt={metadata.channelName}
                className="h-10 w-auto object-contain"
              />
            )}
            <div className="text-white">
              <h1 className="text-xl font-bold">{title}</h1>
              {metadata?.channelName && (
                <p className="text-sm text-white/80">{metadata.channelName}</p>
              )}
            </div>
          </div>
          {metadata && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowInfo(!showInfo)}
              className="text-white hover:bg-white/20"
            >
              <Info className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      {/* Player Container */}
      <div ref={playerRef} className="w-full h-full" />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Info Overlay */}
      {showInfo && metadata && (
        <div className="absolute bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black via-black/95 to-transparent p-6 animate-in slide-in-from-bottom">
          <div className="max-w-4xl">
            {metadata.category && (
              <p className="text-primary text-sm font-semibold mb-2">
                {metadata.category}
              </p>
            )}
            <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
            {metadata.description && (
              <p className="text-white/80 text-base leading-relaxed">
                {metadata.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClapprPlayer;
