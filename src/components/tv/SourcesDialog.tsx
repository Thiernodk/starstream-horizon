import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Trash2, Link2, TvIcon, Plus } from "lucide-react";
import { AddM3UDialog } from "./AddM3UDialog";
import { AddChannelDialog } from "./AddChannelDialog";

interface Source {
  id: string;
  name: string;
  url: string;
  type: 'M3U' | 'Manual';
}

interface SourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customSources: Source[];
  onAddSource: (source: { name: string; url: string; type: 'M3U' }) => void;
  onRemoveSource: (sourceId: string) => void;
  onAddChannel: (channel: { name: string; url: string; logo: string; group: string; sourceId: string }) => void;
  customChannels: Array<{ id: string; name: string; url: string; logo: string; group: string; sourceId: string }>;
  onRemoveChannel: (channelId: string) => void;
}

export const SourcesDialog = ({ 
  open, 
  onOpenChange, 
  customSources, 
  onAddSource, 
  onRemoveSource,
  onAddChannel,
  customChannels,
  onRemoveChannel 
}: SourcesDialogProps) => {
  const [showAddM3U, setShowAddM3U] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              Gérer les sources de chaînes
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Add buttons */}
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setShowAddM3U(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" />
                Ajouter liste M3U
              </Button>
              <Button 
                onClick={() => setShowAddChannel(true)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <TvIcon className="w-4 h-4" />
                Ajouter chaîne manuelle
              </Button>
            </div>

            {/* Sources list */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Sources configurées</h3>
              
              {/* Default source */}
              <div className="p-4 border border-border rounded-lg bg-card">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-card-foreground">Source par défaut</h4>
                      <Badge variant="secondary">Système</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Chaînes françaises officielles (IPTV-org)
                    </p>
                  </div>
                </div>
              </div>

              {/* Custom sources */}
              {customSources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Aucune source personnalisée</p>
                  <p className="text-sm">Ajoutez des listes M3U ou des chaînes manuelles</p>
                </div>
              ) : (
                customSources.map((source) => (
                  <div key={source.id} className="p-4 border border-border rounded-lg bg-card">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-card-foreground">{source.name}</h4>
                          <Badge variant={source.type === 'M3U' ? 'default' : 'secondary'}>
                            {source.type === 'M3U' ? 'Liste M3U' : 'Manuel'}
                          </Badge>
                        </div>
                        {source.type === 'M3U' && (
                          <p className="text-sm text-muted-foreground truncate">
                            {source.url}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveSource(source.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Manual channels section */}
            {customChannels.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Chaînes manuelles</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {customChannels.map((channel) => (
                    <div key={channel.id} className="p-3 border border-border rounded-lg bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <img 
                            src={channel.logo} 
                            alt={channel.name}
                            className="w-8 h-8 rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/32x32/0EA5E9/FFFFFF?text=${encodeURIComponent(channel.name.charAt(0))}`;
                            }}
                          />
                          <div className="space-y-1">
                            <h4 className="font-medium text-card-foreground text-sm">{channel.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{channel.group}</Badge>
                              <span className="text-xs text-muted-foreground truncate max-w-48">
                                {channel.url}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveChannel(channel.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddM3UDialog
        open={showAddM3U}
        onOpenChange={setShowAddM3U}
        onAdd={onAddSource}
      />

      <AddChannelDialog
        open={showAddChannel}
        onOpenChange={setShowAddChannel}
        onAdd={onAddChannel}
        customSources={customSources}
      />
    </>
  );
};