import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TvIcon, Plus } from "lucide-react";

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (channel: { name: string; url: string; logo: string; group: string; sourceId: string }) => void;
  customSources: Array<{ id: string; name: string; type: string }>;
}

export const AddChannelDialog = ({ open, onOpenChange, onAdd, customSources }: AddChannelDialogProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logo, setLogo] = useState("");
  const [group, setGroup] = useState("");
  const [sourceId, setSourceId] = useState("");
  const [loading, setLoading] = useState(false);

  // Get or create a Manual source
  const manualSource = customSources.find(s => s.type === 'Manual') || { id: 'manual', name: 'Chaînes manuelles', type: 'Manual' };

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
        sourceId: finalSourceId 
      });
      
      // Reset form
      setName("");
      setUrl("");
      setLogo("");
      setGroup("");
      setSourceId("");
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
            <TvIcon className="w-5 h-5 text-primary" />
            Ajouter une chaîne
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Nom de la chaîne</Label>
            <Input
              id="channel-name"
              placeholder="ex: StarTimes Sports 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stream-url">URL du stream</Label>
            <Input
              id="stream-url"
              type="url"
              placeholder="https://example.com/stream.m3u8"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-url">URL du logo (optionnel)</Label>
            <Input
              id="logo-url"
              type="url"
              placeholder="https://example.com/logo.png"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel-group">Catégorie</Label>
            <Input
              id="channel-group"
              placeholder="ex: Sport, Cinéma, Infos..."
              value={group}
              onChange={(e) => setGroup(e.target.value)}
            />
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