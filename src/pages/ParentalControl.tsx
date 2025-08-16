import { Shield, Lock, Eye, EyeOff, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const ParentalControl = () => {
  const profiles = [
    {
      id: 1,
      name: "Enfants",
      ageLimit: "6+",
      active: true,
      restrictions: ["Violence", "Langage explicite"]
    },
    {
      id: 2,
      name: "Adolescents",
      ageLimit: "13+",
      active: true,
      restrictions: ["Contenu mature"]
    }
  ];

  const contentCategories = [
    { name: "Tout public", age: "0+", color: "bg-green-500" },
    { name: "Enfants", age: "6+", color: "bg-blue-500" },
    { name: "Famille", age: "10+", color: "bg-yellow-500" },
    { name: "Adolescents", age: "13+", color: "bg-orange-500" },
    { name: "Adultes", age: "18+", color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Contrôle Parental</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Activation du contrôle parental */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-lg font-semibold">Contrôle parental</h2>
                <p className="text-sm text-muted-foreground">Protégez vos enfants avec des restrictions de contenu</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="p-4 bg-primary/10 rounded-lg">
            <p className="text-sm">
              Le contrôle parental est activé. Les contenus sont filtrés selon les profils configurés.
            </p>
          </div>
        </Card>

        {/* PIN de sécurité */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Code PIN de sécurité</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Code PIN actuel</label>
              <Input type="password" placeholder="••••" className="mt-1" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Nouveau code PIN</label>
              <Input type="password" placeholder="••••" className="mt-1" />
            </div>
            
            <div>
              <label className="text-sm font-medium">Confirmer le code PIN</label>
              <Input type="password" placeholder="••••" className="mt-1" />
            </div>
            
            <Button>Modifier le code PIN</Button>
          </div>
        </Card>

        {/* Profils existants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Profils configurés</h2>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau profil
            </Button>
          </div>
          
          {profiles.map((profile) => (
            <Card key={profile.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">Limite d'âge: {profile.ageLimit}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch checked={profile.active} />
                  <Button size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile.restrictions.map((restriction, index) => (
                  <Badge key={index} variant="secondary">{restriction}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Classifications par âge */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Classifications par âge</h2>
          
          <div className="space-y-3">
            {contentCategories.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${category.color}`} />
                  <div>
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({category.age})</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch />
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Horaires de visionnage */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Horaires de visionnage</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Activer les restrictions horaires</span>
              <Switch />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Début autorisé</label>
                <Input type="time" defaultValue="07:00" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">Fin autorisée</label>
                <Input type="time" defaultValue="20:00" className="mt-1" />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Jours de la semaine</label>
              <div className="flex gap-2 mt-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <Button key={day} variant="outline" size="sm" className="flex-1">
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ParentalControl;