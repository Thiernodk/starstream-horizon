import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface AudioPlayerProps {
  src: string;
  title: string;
  artist?: string;
  cover?: string;
  className?: string;
}

const AudioPlayer = ({ src, title, artist, cover, className = "" }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([0.8]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = src;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0];
    audio.volume = newVolume;
    setVolume([newVolume]);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = value[0];
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className={`p-4 bg-gradient-primary ${className}`}>
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center gap-4">
        {cover && (
          <div className="w-16 h-16 bg-gradient-card rounded-lg flex items-center justify-center shrink-0">
            <img 
              src={cover} 
              alt={title}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-white text-sm">{title}</h3>
              {artist && <p className="text-white/80 text-xs">{artist}</p>}
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white hover:bg-white/20"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="w-8 h-8 text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-white hover:bg-white/20"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <Slider
              value={[currentTime]}
              onValueChange={handleSeek}
              max={duration || 100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-white/60 text-xs mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume control */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="w-6 h-6 text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </Button>
            
            <div className="flex-1">
              <Slider
                value={volume}
                onValueChange={handleVolumeChange}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;