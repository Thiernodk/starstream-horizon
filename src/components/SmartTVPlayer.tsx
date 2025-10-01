import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SmartTVPlayerProps {
  src: string;
  title: string;
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

const SmartTVPlayer = ({
  src,
  title,
  onBack,
  poster,
  metadata,
  autoplay = true,
  controls = true,
}: SmartTVPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      controls,
      autoplay,
      preload: "auto",
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",
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

    // Set video source
    player.src({
      src,
      type: getVideoType(src),
    });

    if (poster) {
      player.poster(poster);
    }

    // Cleanup
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay, controls]);

  const getVideoType = (url: string): string => {
    if (url.includes(".m3u8")) return "application/x-mpegURL";
    if (url.includes(".mp4")) return "video/mp4";
    if (url.includes(".webm")) return "video/webm";
    if (url.includes(".m3u")) return "application/x-mpegURL";
    return "application/x-mpegURL";
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Top overlay with back button */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            )}
            {metadata?.channelLogo && (
              <img
                src={metadata.channelLogo}
                alt={metadata.channelName}
                className="h-12 object-contain"
              />
            )}
            <div>
              <h1 className="text-white text-xl font-semibold">{title}</h1>
              {metadata?.channelName && (
                <p className="text-white/70 text-sm">{metadata.channelName}</p>
              )}
            </div>
          </div>
          
          <Button
            onClick={() => setShowInfo(!showInfo)}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 rounded-full"
          >
            <Info className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center">
        <div data-vjs-player className="w-full h-full">
          <video
            ref={videoRef}
            className="video-js vjs-big-play-centered vjs-theme-fantasy w-full h-full"
          />
        </div>
      </div>

      {/* Info overlay */}
      {showInfo && metadata && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-8">
          <div className="max-w-3xl">
            {metadata.category && (
              <p className="text-primary text-sm font-medium mb-2">
                {metadata.category}
              </p>
            )}
            <h2 className="text-white text-2xl font-bold mb-3">{title}</h2>
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

export default SmartTVPlayer;
