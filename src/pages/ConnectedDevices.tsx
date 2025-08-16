import { Monitor, Smartphone, Tablet, Tv, Wifi, WifiOff, MoreVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const ConnectedDevices = () => {
  const devices = [
    {
      id: 1,
      name: "iPhone de Marie",
      type: "mobile",
      os: "iOS 17.2",
      lastActive: "En ligne",
      location: "Paris, France",
      active: true
    },
    {
      id: 2,
      name: "MacBook Pro",
      type: "computer",
      os: "macOS Sonoma",
      lastActive: "Il y a 2h",
      location: "Paris, France",
      active: false
    },
    {
      id: 3,
      name: "Samsung Smart TV",
      type: "tv",
      os: "Tizen 7.0",
      lastActive: "Il y a 1 jour",
      location: "Salon",
      active: false
    },
    {
      id: 4,
      name: "iPad Air",
      type: "tablet",
      os: "iPadOS 17.2",
      lastActive: "Il y a 3 jours",
      location: "Paris, France",
      active: false
    }
  ];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="w-6 h-6" />;
      case "tablet":
        return <Tablet className="w-6 h-6" />;
      case "tv":
        return <Tv className="w-6 h-6" />;
      default:
        return <Monitor className="w-6 h-6" />;
    }
  };

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case "mobile":
        return "Téléphone";
      case "tablet":
        return "Tablette";
      case "tv":
        return "Smart TV";
      default:
        return "Ordinateur";
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Appareils Connectés</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{devices.length}</div>
            <div className="text-sm text-muted-foreground">Total appareils</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {devices.filter(d => d.active).length}
            </div>
            <div className="text-sm text-muted-foreground">Actifs</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">2</div>
            <div className="text-sm text-muted-foreground">Limite atteinte</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">5</div>
            <div className="text-sm text-muted-foreground">Limite max</div>
          </Card>
        </div>

        {/* Appareil actuel */}
        <Card className="p-6 border-primary/50 bg-primary/5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Cet appareil</h3>
              <p className="text-sm text-muted-foreground">iPhone de Marie • iOS 17.2</p>
            </div>
            <Badge className="bg-success">En ligne</Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wifi className="w-4 h-4" />
            <span>Connexion sécurisée depuis Paris, France</span>
          </div>
        </Card>

        {/* Actions rapides */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un appareil
          </Button>
          <Button variant="outline" className="flex-1">
            Déconnecter tous
          </Button>
        </div>

        {/* Liste des appareils */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Tous les appareils</h2>
          
          {devices.map((device) => (
            <Card key={device.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground">
                  {getDeviceIcon(device.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{device.name}</h3>
                    {device.active ? (
                      <div className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-success" />
                        <Badge variant="secondary" className="bg-success/20 text-success text-xs">
                          En ligne
                        </Badge>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <WifiOff className="w-3 h-3 text-muted-foreground" />
                        <Badge variant="secondary" className="text-xs">
                          Hors ligne
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {getDeviceTypeName(device.type)} • {device.os}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Dernière activité: {device.lastActive}</span>
                    <span>•</span>
                    <span>{device.location}</span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Voir les détails</DropdownMenuItem>
                    <DropdownMenuItem>Renommer</DropdownMenuItem>
                    {device.active && (
                      <DropdownMenuItem className="text-warning">
                        Déconnecter
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-destructive">
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>

        {/* Informations sur les limites */}
        <Card className="p-6 bg-warning/10 border-warning/20">
          <h3 className="font-semibold text-warning mb-2">Limite d'appareils</h3>
          <p className="text-sm text-muted-foreground">
            Vous avez atteint 2 appareils sur 5 autorisés avec votre abonnement Premium. 
            Vous pouvez connecter 3 appareils supplémentaires.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ConnectedDevices;