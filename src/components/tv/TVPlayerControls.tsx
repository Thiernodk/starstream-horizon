import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  RotateCcw,
  RotateCw,
  Square,
  Settings,
  Zap,
  List,
  Cast,
  PictureInPicture2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface TVPlayerControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number[];
  currentTime: number;
  duration: number;
  showControls: boolean;
  isFullscreen: boolean;
  quality: string;
  audioTrack: number;
  subtitles: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (value: number[]) => void;
  onToggleFullscreen: () => void;
  onSeek: (seconds: number) => void;
  onRestart: () => void;
  onBack: () => void;
  onShowSettings: () => void;
  onShowZap: () => void;
  onShowEPG: () => void;
}

const TVPlayerControls = ({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  showControls,
  isFullscreen,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
  onToggleFullscreen,
  onSeek,
  onRestart,
  onBack,
  onShowSettings,
  onShowZap,
  onShowEPG,
}: TVPlayerControlsProps) => {
  const formatTime = (time: number) => {
    if (!isFinite(time)) return "LIVE";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const enablePiP = async () => {
    const video = document.querySelector('video');
    if (video && 'pictureInPictureEnabled' in document) {
      try {
        await (video as any).requestPictureInPicture();
      } catch (error) {
        console.log('Picture-in-Picture failed:', error);
      }
    }
  };

  return (
    <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
      showControls ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
    }`}>
      <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent p-4">
        
        {/* Timeshift bar (for live streams) */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-white/60 text-xs mb-2">
            <span>Direct</span>
            <div className="flex-1 bg-white/20 rounded-full h-1">
              <div className="bg-destructive h-1 rounded-full w-full" />
            </div>
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onTogglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSeek(-10)}
              className="text-white hover:bg-white/20"
              title="Reculer 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSeek(10)}
              className="text-white hover:bg-white/20"
              title="Avancer 10s"
            >
              <RotateCw className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onRestart}
              className="text-white hover:bg-white/20"
              title="Reprendre depuis le début"
            >
              <Square className="w-5 h-5" />
            </Button>

            {/* Volume Controls */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleMute}
                className="text-white hover:bg-white/20"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <div className="w-20 hidden md:block">
                <Slider
                  value={volume}
                  onValueChange={onVolumeChange}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Center Info */}
          <div className="hidden md:block text-center text-white/80">
            <div className="text-sm">
              Diffusion en direct
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShowEPG}
              className="text-white hover:bg-white/20"
              title="Guide TV"
            >
              <List className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onShowZap}
              className="text-white hover:bg-white/20"
              title="Liste des chaînes"
            >
              <Zap className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={enablePiP}
              className="text-white hover:bg-white/20"
              title="Picture-in-Picture"
            >
              <PictureInPicture2 className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* Cast functionality */}}
              className="text-white hover:bg-white/20"
              title="Diffuser"
            >
              <Cast className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onShowSettings}
              className="text-white hover:bg-white/20"
              title="Paramètres"
            >
              <Settings className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVPlayerControls;