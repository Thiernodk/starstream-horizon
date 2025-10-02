import { Settings, User, Heart, Clock, Shield, Headphones, MessageCircle, HelpCircle, CreditCard, Monitor, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();
  const menuSections = [
    {
      title: "Mon Compte",
      items: [
        { icon: User, label: "Profil utilisateur", description: "Gérer mes informations" },
        { icon: CreditCard, label: "Abonnement", description: "Plan Premium actif" },
        { icon: Monitor, label: "Appareils connectés", description: "2 appareils actifs" }
      ]
    },
    {
      title: "Mes Contenus",
      items: [
        { icon: Heart, label: "Favoris", description: "Contenus sauvegardés" },
        { icon: Clock, label: "Historique", description: "Récemment regardés" },
        { icon: Shield, label: "Contrôle parental", description: "Restrictions d'âge" }
      ]
    },
    {
      title: "Technique",
      items: [
        { icon: Settings, label: "DVB-T2", description: "Réglages antenne TNT" },
        { icon: Tv, label: "Connexion Smart TV", description: "Connecter votre téléviseur" },
        { icon: Settings, label: "Paramètres", description: "Configuration app" }
      ]
    },
    {
      title: "Support",
      items: [
        { icon: Headphones, label: "Support client", description: "Assistance 24/7" },
        { icon: MessageCircle, label: "Messagerie", description: "Conversations en cours" },
        { icon: HelpCircle, label: "FAQ", description: "Questions fréquentes" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Menu</h1>
      </div>

      <div className="px-4 py-6">
        {/* User info card */}
        <Card className="mb-6 p-6 bg-gradient-card">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Utilisateur Premium</h2>
              <p className="text-muted-foreground">Abonnement actif jusqu'au 15 mars 2025</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span className="text-sm text-success">Compte vérifié</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Menu sections */}
        <div className="space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                {section.title}
              </h3>
              
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={item.label}
                    variant="card"
                    className="w-full justify-start h-auto p-4 text-left"
                    onClick={() => {
                      // Navigation logic based on item label
                      switch(item.label) {
                        case "Profil utilisateur":
                          navigate("/profile");
                          break;
                        case "Abonnement":
                          navigate("/subscription");
                          break;
                        case "Appareils connectés":
                          navigate("/connected-devices");
                          break;
                        case "Contrôle parental":
                          navigate("/parental-control");
                          break;
                        case "DVB-T2":
                          navigate("/dvb-t2");
                          break;
                        case "Connexion Smart TV":
                          navigate("/connexion-smart-tv");
                          break;
                        case "Support client":
                          navigate("/support");
                          break;
                        case "Messagerie":
                          navigate("/notifications");
                          break;
                        default:
                          break;
                      }
                    }}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <item.icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-primary rounded-full shrink-0" />
                    </div>
                  </Button>
                ))}
              </div>
              
              {sectionIndex < menuSections.length - 1 && (
                <Separator className="mt-6" />
              )}
            </div>
          ))}
        </div>

        {/* Version info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>N.S Stream v1.0.0</p>
          <p>© 2024 N.S Stream. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  );
};

export default Menu;