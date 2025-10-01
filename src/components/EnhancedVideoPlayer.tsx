import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface EnhancedVideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  onBack?: () => void;
  metadata?: {
    channelName?: string;
    channelLogo?: string;
    category?: string;
    tvgId?: string;
    epgUrl?: string;
    description?: string;
  };
  autoplay?: boolean;
  controls?: boolean;
}

const EnhancedVideoPlayer = ({
  src,
  title,
  poster,
  onBack,
  metadata,
  autoplay = false,
  controls = true,
}: EnhancedVideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [showMetadata, setShowMetadata] = useState(true);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls: controls,
      autoplay: autoplay,
      preload: "auto",
      fluid: true,
      responsive: true,
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
      },
    });

    playerRef.current = player;

    // Set the source
    player.src({
      src: src,
      type: getVideoType(src),
    });

    if (poster) {
      player.poster(poster);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay, controls]);

  const getVideoType = (url: string): string => {
    if (url.includes(".m3u8")) {
      return "application/x-mpegURL";
    } else if (url.includes(".m3u")) {
      return "application/x-mpegURL";
    } else if (url.includes(".mp4")) {
      return "video/mp4";
    } else if (url.includes(".webm")) {
      return "video/webm";
    } else if (url.includes(".mkv")) {
      return "video/x-matroska";
    } else if (url.includes(".ts")) {
      return "video/MP2T";
    }
    return "application/x-mpegURL"; // Default to HLS
  };

  return (
    <div className="relative min-h-screen bg-black">
      {/* Header with back button */}
      {onBack && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            {metadata && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMetadata(!showMetadata)}
                className="text-white hover:bg-white/20"
              >
                <Info className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="w-full h-screen">
        <div data-vjs-player>
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered vjs-fluid"
            playsInline
          />
        </div>
      </div>

      {/* Metadata Overlay */}
      {metadata && showMetadata && (
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/90 to-transparent p-6 pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Channel info */}
            {metadata.channelLogo && (
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={metadata.channelLogo}
                  alt={metadata.channelName}
                  className="w-12 h-12 object-contain bg-white/10 rounded-lg p-2"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
                <div>
                  <h2 className="text-white font-semibold text-lg">
                    {metadata.channelName || title}
                  </h2>
                  {metadata.category && (
                    <Badge variant="secondary" className="mt-1">
                      {metadata.category}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Program title */}
            {title && (
              <h1 className="text-white text-2xl font-bold mb-2">{title}</h1>
            )}

            {/* Description */}
            {metadata.description && (
              <p className="text-white/80 text-sm mb-3">{metadata.description}</p>
            )}

            {/* Technical info */}
            <div className="flex items-center gap-4 text-xs text-white/60">
              {metadata.tvgId && (
                <span className="flex items-center gap-1">
                  <span className="text-white/40">ID:</span>
                  {metadata.tvgId}
                </span>
              )}
              {metadata.epgUrl && (
                <span className="flex items-center gap-1">
                  <span className="text-green-400">●</span>
                  EPG Disponible
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedVideoPlayer;
