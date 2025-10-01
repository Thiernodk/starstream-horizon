import { Clock, Info } from "lucide-react";
import { useEPG } from "@/hooks/useEPG";

interface EPGBannerProps {
  channelTvgId?: string;
  epgUrl?: string;
  channelLogo?: string;
  channelName: string;
  showControls: boolean;
}

const EPGBanner = ({ channelTvgId, epgUrl, channelLogo, channelName, showControls }: EPGBannerProps) => {
  const { getCurrentProgram, getNextProgram, loading } = useEPG({ channelTvgId, epgUrl });

  const currentProgram = getCurrentProgram();
  const nextProgram = getNextProgram();

  if (loading) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getProgress = () => {
    if (!currentProgram) return 0;
    const now = new Date();
    const total = currentProgram.stopTime.getTime() - currentProgram.startTime.getTime();
    const elapsed = now.getTime() - currentProgram.startTime.getTime();
    return Math.max(0, Math.min(100, (elapsed / total) * 100));
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-4">
      <div className="flex items-start gap-4">
        {/* Channel Logo */}
        {channelLogo && (
          <div className="flex-shrink-0">
            <img
              src={channelLogo}
              alt={channelName}
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>
        )}

        {/* EPG Content */}
        <div className="flex-1 min-w-0">
          {/* Current Program */}
          {currentProgram ? (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 font-semibold text-sm">🔴 EN COURS</span>
                <span className="text-sm text-gray-300">
                  {formatTime(currentProgram.startTime)} - {formatTime(currentProgram.stopTime)}
                </span>
              </div>
              <h3 className="text-lg font-bold line-clamp-1">{currentProgram.title}</h3>
              <p className="text-sm text-gray-300 line-clamp-2">{currentProgram.description}</p>
              
              {/* Progress bar */}
              <div className="mt-2 w-full h-1 bg-gray-600 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-red-500 font-semibold text-sm">🔴 LIVE</span>
              </div>
              <h3 className="text-lg font-bold">{channelName}</h3>
              <p className="text-sm text-gray-300">Diffusion en direct</p>
            </div>
          )}

          {/* Next Program */}
          {nextProgram && (
            <div className="border-t border-gray-600 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm text-gray-400">À SUIVRE</span>
                <span className="text-sm text-gray-400">
                  {formatTime(nextProgram.startTime)} - {formatTime(nextProgram.stopTime)}
                </span>
              </div>
              <h4 className="text-base font-medium line-clamp-1">{nextProgram.title}</h4>
            </div>
          )}
        </div>

        {/* Info Icon */}
        <div className="flex-shrink-0">
          <Info className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default EPGBanner;