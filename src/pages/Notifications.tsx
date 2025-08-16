import { Bell, Settings, Check, X, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "Nouveau contenu disponible",
      message: "La saison 5 de votre série préférée est maintenant disponible !",
      time: "Il y a 2h",
      read: false
    },
    {
      id: 2,
      type: "warning",
      title: "Abonnement expire bientôt",
      message: "Votre abonnement expire dans 5 jours. Renouvelez-le maintenant.",
      time: "Il y a 1 jour",
      read: false
    },
    {
      id: 3,
      type: "success",
      title: "Paiement confirmé",
      message: "Votre paiement a été traité avec succès. Merci !",
      time: "Il y a 3 jours",
      read: true
    },
    {
      id: 4,
      type: "info",
      title: "Maintenance programmée",
      message: "Maintenance du service prévue dimanche de 2h à 4h du matin.",
      time: "Il y a 1 semaine",
      read: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "success":
        return <Check className="w-5 h-5 text-success" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "warning":
        return <Badge variant="destructive">Important</Badge>;
      case "success":
        return <Badge className="bg-success">Confirmé</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Notifications</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Paramètres de notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Paramètres des notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Nouveaux contenus</p>
                <p className="text-sm text-muted-foreground">Être notifié des nouveaux films et séries</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Rappels d'abonnement</p>
                <p className="text-sm text-muted-foreground">Alertes avant expiration</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Maintenance</p>
                <p className="text-sm text-muted-foreground">Informations de maintenance</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotions</p>
                <p className="text-sm text-muted-foreground">Offres spéciales et réductions</p>
              </div>
              <Switch />
            </div>
          </div>
        </Card>

        {/* Actions rapides */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            Tout marquer lu
          </Button>
          <Button variant="outline" className="flex-1">
            <X className="w-4 h-4 mr-2" />
            Effacer tout
          </Button>
        </div>

        {/* Liste des notifications */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Notifications récentes</h2>
          
          {notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`p-4 ${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{notification.title}</h3>
                    {getNotificationBadge(notification.type)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                    
                    {!notification.read && (
                      <Button size="sm" variant="ghost" className="text-xs">
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;