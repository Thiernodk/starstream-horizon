import { X, Video, Mic, Subtitles, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TVPlayerSettingsProps {
  onClose: () => void;
  quality: string;
  onQualityChange: (value: string) => void;
  audioTrack: number;
  onAudioTrackChange: (value: number) => void;
  subtitles: boolean;
  onSubtitlesChange: (value: boolean) => void;
}

const TVPlayerSettings = ({
  onClose,
  quality,
  onQualityChange,
  audioTrack,
  onAudioTrackChange,
  subtitles,
  onSubtitlesChange,
}: TVPlayerSettingsProps) => {
  const qualityOptions = [
    { value: "480p", label: "480p (Défaut)" },
    { value: "720p", label: "720p" },
    { value: "1080p", label: "1080p" },
    { value: "auto", label: "Auto" },
  ];

  const audioTracks = [
    { value: 0, label: "Français (Principal)" },
    { value: 1, label: "Français (Audio Description)" },
    { value: 2, label: "English" },
  ];

  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-card-foreground">Paramètres de lecture</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Video Quality */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-card-foreground">
                Qualité vidéo
              </label>
            </div>
            <Select value={quality} onValueChange={onQualityChange}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audio Track */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-card-foreground">
                Piste audio
              </label>
            </div>
            <Select value={audioTrack.toString()} onValueChange={(value) => onAudioTrackChange(parseInt(value))}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {audioTracks.map((track) => (
                  <SelectItem key={track.value} value={track.value.toString()}>
                    {track.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subtitles */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Subtitles className="w-4 h-4 text-primary" />
              <label className="text-sm font-medium text-card-foreground">
                Sous-titres
              </label>
            </div>
            <Switch
              checked={subtitles}
              onCheckedChange={onSubtitlesChange}
            />
          </div>

          {/* Network Info */}
          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-success" />
              <label className="text-sm font-medium text-card-foreground">
                Statut réseau
              </label>
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Débit:</span>
                <span className="text-success">8.5 Mbps</span>
              </div>
              <div className="flex justify-between">
                <span>Latence:</span>
                <span className="text-success">45ms</span>
              </div>
              <div className="flex justify-between">
                <span>Buffer:</span>
                <span className="text-success">5.2s</span>
              </div>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-medium text-card-foreground">Paramètres avancés</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Hardware acceleration
              </label>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Low latency mode
              </label>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-muted-foreground">
                Auto quality adaptation
              </label>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TVPlayerSettings;