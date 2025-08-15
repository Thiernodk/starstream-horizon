import { useState } from "react";
import { User, Settings, Shield, Smartphone, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);

  const userInfo = {
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    subscription: "Premium",
    joinDate: "Janvier 2024",
    avatar: "https://via.placeholder.com/80x80/0EA5E9/FFFFFF?text=JD"
  };

  const connectedDevices = [
    { id: 1, name: "iPhone de Jean", type: "Mobile", lastUsed: "Maintenant", current: true },
    { id: 2, name: "Smart TV Samsung", type: "TV", lastUsed: "Il y a 2h" },
    { id: 3, name: "MacBook Pro", type: "Ordinateur", lastUsed: "Hier" }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Profil</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gradient-card rounded-full flex items-center justify-center">
              <img src={userInfo.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">{userInfo.name}</h2>
              <p className="text-muted-foreground">{userInfo.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">{userInfo.subscription}</Badge>
                <span className="text-sm text-muted-foreground">Membre depuis {userInfo.joinDate}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Modifier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input id="name" defaultValue={userInfo.name} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={userInfo.email} className="mt-1" />
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Paramètres
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications push</p>
                <p className="text-sm text-muted-foreground">Recevoir les alertes sur vos appareils</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Lecture automatique</p>
                <p className="text-sm text-muted-foreground">Démarrer la lecture au survol</p>
              </div>
              <Switch checked={autoPlay} onCheckedChange={setAutoPlay} />
            </div>
          </div>
        </Card>

        {/* Connected Devices */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Appareils connectés
          </h3>
          <div className="space-y-3">
            {connectedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-card rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.type} • {device.lastUsed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {device.current && (
                    <Badge variant="default" className="text-xs">Actuel</Badge>
                  )}
                  {!device.current && (
                    <Button variant="outline" size="sm">Déconnecter</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Sécurité
          </h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Changer le mot de passe
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Authentification à deux facteurs
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Historique de connexion
            </Button>
          </div>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button variant="destructive" className="w-full justify-start">
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
          <Button variant="outline" className="w-full justify-start text-muted-foreground">
            Supprimer le compte
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;