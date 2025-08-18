
import { Play } from "lucide-react";

type ChannelListItemProps = {
  name: string;
  logo: string;
  active?: boolean;
  onClick?: () => void;
};

const ChannelListItem = ({ name, logo, active, onClick }: ChannelListItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg overflow-hidden border transition-all hover:shadow-card-hover ${
        active ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-primary/40"
      }`}
    >
      <div className="relative aspect-video bg-muted/40">
        <img
          src={logo}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://via.placeholder.com/640x360/0EA5E9/FFFFFF?text=${encodeURIComponent(
              name.slice(0, 8)
            )}`;
          }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {/* Play icon on hover */}
        <div className="absolute inset-0 hidden items-center justify-center md:group-hover:flex">
          <div className="bg-black/50 rounded-full p-3">
            <Play className="w-5 h-5 text-white" />
          </div>
        </div>
        {/* Progress bar (decorative) */}
        <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/20">
          <div className="h-1 bg-destructive w-1/5" />
        </div>
      </div>
    </button>
  );
};

export default ChannelListItem;
