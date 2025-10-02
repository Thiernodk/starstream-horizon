import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link2, Plus } from "lucide-react";

interface AddM3UDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (source: { name: string; url: string; type: 'M3U' }) => void;
}

export const AddM3UDialog = ({ open, onOpenChange, onAdd }: AddM3UDialogProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    setLoading(true);
    try {
      onAdd({ name: name.trim(), url: url.trim(), type: 'M3U' });
      setName("");
      setUrl("");
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
            <Link2 className="w-5 h-5 text-primary" />
            Ajouter une liste M3U
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-name">Nom de la source</Label>
            <Input
              id="source-name"
              placeholder="ex: N.S Sports"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="m3u-url">URL de la liste M3U</Label>
            <Input
              id="m3u-url"
              type="url"
              placeholder="https://example.com/playlist.m3u"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
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