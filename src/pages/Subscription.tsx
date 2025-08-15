import { Check, Crown, Zap, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Subscription = () => {
  const plans = [
    {
      id: "free",
      name: "Gratuit",
      price: "0€",
      period: "/mois",
      features: [
        "Accès limité aux chaînes",
        "Publicités incluses",
        "Qualité standard",
        "1 appareil simultané"
      ],
      current: true,
      color: "from-gray-600 to-gray-400"
    },
    {
      id: "premium",
      name: "Premium",
      price: "9,99€",
      period: "/mois",
      features: [
        "Toutes les chaînes HD",
        "Sans publicité",
        "Qualité Ultra HD",
        "3 appareils simultanés",
        "Enregistrement cloud",
        "Replay 7 jours"
      ],
      popular: true,
      color: "from-primary to-primary-glow"
    },
    {
      id: "family",
      name: "Famille",
      price: "14,99€", 
      period: "/mois",
      features: [
        "Toutes les chaînes HD",
        "Sans publicité",
        "Qualité Ultra HD",
        "5 appareils simultanés",
        "Enregistrement cloud illimité",
        "Replay 30 jours",
        "Contrôle parental avancé",
        "Profils personnalisés"
      ],
      color: "from-purple-600 to-purple-400"
    }
  ];

  const paymentMethods = [
    { id: "mobile", name: "Mobile Money", icon: "📱", available: true },
    { id: "card", name: "Carte bancaire", icon: "💳", available: true },
    { id: "paypal", name: "PayPal", icon: "🔵", available: true },
    { id: "startimes", name: "Décodeur StarTimes", icon: "📺", available: true, note: "Max 2 comptes" }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-purple-400 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Abonnements</h1>
      </div>

      <div className="px-4 py-6">
        {/* Trial Banner */}
        <Card className="mb-6 p-4 bg-gradient-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <h3 className="font-semibold">Essai gratuit disponible</h3>
              <p className="text-sm opacity-90">30 minutes d'accès premium pour découvrir nos services</p>
            </div>
            <Button variant="outline" className="ml-auto bg-white/20 border-white/30 text-white hover:bg-white/30">
              Commencer l'essai
            </Button>
          </div>
        </Card>

        {/* Plans */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Choisissez votre abonnement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-1">
                    <span className="text-sm font-medium flex items-center justify-center gap-1">
                      <Crown className="w-4 h-4" />
                      Le plus populaire
                    </span>
                  </div>
                )}
                
                <div className={`h-2 bg-gradient-to-r ${plan.color}`} />
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                    {plan.current && (
                      <Badge variant="secondary" className="mt-2">Actuel</Badge>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.popular ? "default" : "outline"} 
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? "Abonnement actuel" : `Choisir ${plan.name}`}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Moyens de paiement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paymentMethods.map((method) => (
              <Card key={method.id} className={`p-4 text-center ${method.available ? 'hover:shadow-card-hover transition-all duration-300 cursor-pointer' : 'opacity-50'}`}>
                <div className="text-2xl mb-2">{method.icon}</div>
                <h3 className="font-medium mb-1">{method.name}</h3>
                {method.note && (
                  <p className="text-xs text-muted-foreground">{method.note}</p>
                )}
                {!method.available && (
                  <Badge variant="secondary" className="mt-2">Bientôt disponible</Badge>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Avantages des abonnements payants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Qualité et performance</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Streaming HD et Ultra HD</li>
                <li>• Aucune interruption publicitaire</li>
                <li>• Accès prioritaire aux serveurs</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Fonctionnalités avancées</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Enregistrement et timeshift</li>
                <li>• Replay étendu</li>
                <li>• Multi-écrans synchronisés</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Subscription;