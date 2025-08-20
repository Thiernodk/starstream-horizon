import { Clock } from "lucide-react";

interface TVPlayerOverlayProps {
  channel: {
    name: string;
    logo: string;
  };
  currentProgram: {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    progress: number;
  };
  currentTime: string;
  showControls: boolean;
}

const TVPlayerOverlay = ({ 
  channel, 
  currentProgram, 
  currentTime, 
  showControls 
}: TVPlayerOverlayProps) => {
  return (
    <>
      {/* Top Overlay - Time */}
      <div className={`absolute top-0 left-0 right-0 transition-opacity duration-300 ${
        showControls ? "opacity-100" : "opacity-0"
      }`}>
        <div className="bg-gradient-to-b from-black/80 to-transparent p-6">
          <div className="flex justify-center">
            <div className="flex items-center gap-2 bg-black/50 rounded-lg px-4 py-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-white font-mono text-lg">{currentTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Overlay - Channel info and program */}
      <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${
        showControls ? "opacity-100" : "opacity-0"
      }`}>
        <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pb-24">
          <div className="flex items-end gap-4">
            {/* Channel Logo */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden border border-white/20">
                <img
                  src={channel.logo}
                  alt={channel.name}
                  className="w-full h-full object-contain p-2"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/64x64/0EA5E9/FFFFFF?text=${encodeURIComponent(
                      channel.name.slice(0, 2)
                    )}`;
                  }}
                />
              </div>
            </div>

            {/* Program Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h2 className="text-white text-xl font-semibold mb-1 truncate">
                  {currentProgram.title}
                </h2>
                <p className="text-white/70 text-sm line-clamp-2">
                  {currentProgram.description}
                </p>
              </div>
              
              {/* Program Time and Progress */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <span>{currentProgram.startTime} - {currentProgram.endTime}</span>
                  <span className="px-2 py-0.5 bg-destructive rounded-full text-destructive-foreground">
                    LIVE
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${currentProgram.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default TVPlayerOverlay;