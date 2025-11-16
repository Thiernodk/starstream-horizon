import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TvIcon, Plus, Upload, X, Video } from "lucide-react";

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (channel: { name: string; url: string; logo: string; group: string; sourceId: string; hasEmbeddedPlayer?: boolean }) => void;
  customSources: Array<{ id: string; name: string; type: string }>;
}

export const AddChannelDialog = ({ open, onOpenChange, onAdd, customSources }: AddChannelDialogProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [group, setGroup] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [contentType, setContentType] = useState<"channel" | "vod">("channel");
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get or create a Manual source
  const manualSource = customSources.find(s => s.type === 'Manual') || { id: 'manual', name: 'Chaînes manuelles', type: 'Manual' };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setUploadedImage(imageUrl);
        setLogo(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeUploadedImage = () => {
    setUploadedImage("");
    setLogo("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    try {
      const finalLogo = logo.trim() || `https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=${encodeURIComponent(name.charAt(0))}`;
      const finalGroup = group.trim() || 'Général';
      const finalSourceId = sourceId || manualSource.id;

      onAdd({ 
        name: name.trim(), 
        url: url.trim(), 
        logo: finalLogo, 
        group: finalGroup,
        sourceId: finalSourceId,
        hasEmbeddedPlayer: contentType === "vod"
      });
      
      // Reset form
      setName("");
      setUrl("");
      setLogo("");
      setGroup("");
      setSourceId("");
      setContentType("channel");
      setUploadedImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {contentType === "vod" ? <Video className="w-5 h-5 text-primary" /> : <TvIcon className="w-5 h-5 text-primary" />}
            {contentType === "vod" ? "Ajouter un contenu VOD" : "Ajouter une chaîne"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Type de contenu</Label>
            <RadioGroup value={contentType} onValueChange={(value: "channel" | "vod") => setContentType(value)}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="channel" id="channel" />
                <Label htmlFor="channel" className="flex items-center gap-2 cursor-pointer flex-1">
                  <TvIcon className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">Chaîne TV en direct</div>
                    <div className="text-sm text-muted-foreground">Flux M3U8, RTMP, etc.</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                <RadioGroupItem value="vod" id="vod" />
                <Label htmlFor="vod" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Video className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-medium">Contenu VOD avec lecteur intégré</div>
                    <div className="text-sm text-muted-foreground">Dacast, Castr, Vimeo, YouTube, etc.</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel-name">{contentType === "vod" ? "Nom du contenu" : "Nom de la chaîne"}</Label>
            <Input
              id="channel-name"
              placeholder={contentType === "vod" ? "ex: Webinaire ACADEMY TV" : "ex: N.S Sports 1"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-url">{contentType === "vod" ? "URL du lecteur intégré" : "URL du stream"}</Label>
            <Input
              id="stream-url"
              type="url"
              placeholder={contentType === "vod" ? "https://iframe.dacast.com/..." : "https://example.com/stream.m3u8"}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Logo de la chaîne (optionnel)</Label>
            <div className="space-y-3">
              {uploadedImage && (
                <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                  <img 
                    src={uploadedImage} 
                    alt="Logo uploadé" 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Logo importé</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeUploadedImage}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importer une image
                </Button>
                <div className="flex-1">
                  <Input
                    id="logo-url"
                    type="url"
                    placeholder="ou URL du logo"
                    value={uploadedImage ? "" : logo}
                    onChange={(e) => {
                      setLogo(e.target.value);
                      if (e.target.value) {
                        setUploadedImage("");
                      }
                    }}
                    disabled={!!uploadedImage}
                  />
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel-group">Catégorie</Label>
            <Input
              id="channel-group"
              placeholder={contentType === "vod" ? "ex: ACADEMY TV (recommandé)" : "ex: Sport, Cinéma, Infos..."}
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
            {contentType === "vod" && (
              <p className="text-xs text-muted-foreground">
                💡 Les contenus VOD ajoutés dans "ACADEMY TV" seront isolés et utiliseront leur lecteur intégré
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="source-select">Source</Label>
            <Select value={sourceId} onValueChange={setSourceId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={manualSource.id}>{manualSource.name}</SelectItem>
                {customSources.filter(s => s.type === 'Manual' && s.id !== manualSource.id).map(source => (
                  <SelectItem key={source.id} value={source.id}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || !url.trim()}>
              {loading ? (
                "Ajout..."
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Ajouter
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};