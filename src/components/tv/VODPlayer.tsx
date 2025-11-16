import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VODPlayerProps {
  content: {
    id: string;
    name: string;
    url: string;
    logo?: string;
  };
  onBack: () => void;
}

export const VODPlayer = ({ content, onBack }: VODPlayerProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            {content.logo && (
              <img 
                src={content.logo} 
                alt={content.name} 
                className="w-10 h-10 rounded object-cover"
              />
            )}
            <h1 className="text-xl font-bold text-foreground">{content.name}</h1>
          </div>
        </div>
      </div>

      {/* Embedded player iframe */}
      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <iframe
          src={content.url}
          className="absolute top-0 left-0 w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ border: 'none' }}
        />
      </div>

      {/* Info section */}
      <div className="p-6 bg-card border-t border-border">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          À propos de ce contenu
        </h2>
        <p className="text-muted-foreground">
          Ce contenu utilise un lecteur vidéo intégré fourni par la plateforme d'hébergement.
        </p>
      </div>
    </div>
  );
};
