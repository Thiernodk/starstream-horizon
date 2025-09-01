import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Link, Image } from "lucide-react";

interface AddChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddChannel: (channel: {
    name: string;
    url: string;
    logo: string;
    category: string;
  }) => void;
}

const AddChannelDialog = ({ open, onOpenChange, onAddChannel }: AddChannelDialogProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [logoType, setLogoType] = useState<"url" | "upload">("url");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim()) return;

    let finalLogoUrl = logoUrl;
    
    // If file upload is selected and a file is chosen
    if (logoType === "upload" && logoFile) {
      // Create a local URL for the uploaded file
      finalLogoUrl = URL.createObjectURL(logoFile);
    } else if (!finalLogoUrl) {
      // Generate placeholder if no logo provided
      finalLogoUrl = `https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=${encodeURIComponent(name.charAt(0).toUpperCase())}`;
    }

    onAddChannel({
      name: name.trim(),
      url: url.trim(),
      logo: finalLogoUrl,
      category: category.trim() || "Général"
    });

    // Reset form
    setName("");
    setUrl("");
    setLogoUrl("");
    setLogoFile(null);
    setCategory("");
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une chaîne manuellement</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle chaîne avec son nom, lien M3U et logo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel-name">Nom de la chaîne *</Label>
            <Input
              id="channel-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: France 24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-url">Lien M3U/M3U8 *</Label>
            <Input
              id="channel-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/stream.m3u8"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel-category">Catégorie</Label>
            <Input
              id="channel-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="ex: Sport, Cinéma, Général..."
            />
          </div>

          <div className="space-y-3">
            <Label>Logo de la chaîne</Label>
            
            <Select value={logoType} onValueChange={(value: "url" | "upload") => setLogoType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="url">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Lien URL
                  </div>
                </SelectItem>
                <SelectItem value="upload">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Importer un fichier
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {logoType === "url" ? (
              <Input
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="flex items-center justify-center gap-2 h-10 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-accent transition-colors"
                >
                  <Image className="w-4 h-4" />
                  {logoFile ? logoFile.name : "Choisir un fichier..."}
                </Label>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!name.trim() || !url.trim()}>
              Ajouter la chaîne
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChannelDialog;