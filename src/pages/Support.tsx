import { Headphones, MessageCircle, HelpCircle, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Support = () => {
  const faqItems = [
    {
      question: "Comment regarder les chaînes TV ?",
      answer: "Accédez à la section TV, sélectionnez une chaîne et cliquez pour commencer la lecture."
    },
    {
      question: "Que faire si la vidéo ne se charge pas ?",
      answer: "Vérifiez votre connexion internet et rechargez la page. Si le problème persiste, contactez le support."
    },
    {
      question: "Comment utiliser l'essai gratuit ?",
      answer: "L'essai gratuit de 30 minutes s'active automatiquement lors de votre première lecture."
    },
    {
      question: "Comment changer la qualité vidéo ?",
      answer: "Utilisez les paramètres du lecteur pour sélectionner la qualité désirée."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Support & Aide</h1>
      </div>

      <div className="px-4 py-6">
        <Tabs defaultValue="contact" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="tickets">Tickets</TabsTrigger>
          </TabsList>

          <TabsContent value="contact" className="space-y-6">
            {/* Contact rapide */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 bg-gradient-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <Headphones className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Support 24/7</h3>
                    <p className="text-sm text-muted-foreground">Assistance immédiate</p>
                  </div>
                </div>
                <Button className="w-full">Démarrer le chat</Button>
              </Card>

              <Card className="p-6 bg-gradient-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Appel direct</h3>
                    <p className="text-sm text-muted-foreground">+33 1 23 45 67 89</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full">Appeler</Button>
              </Card>
            </div>

            {/* Formulaire de contact */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Envoyer un message</h3>
              <div className="space-y-4">
                <Input placeholder="Votre nom" />
                <Input placeholder="Email" type="email" />
                <Input placeholder="Sujet" />
                <Textarea placeholder="Décrivez votre problème..." className="min-h-[120px]" />
                <Button className="w-full">Envoyer le message</Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold mb-2 text-primary">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            {/* Nouveau ticket */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Créer un nouveau ticket</h3>
              <div className="space-y-4">
                <Input placeholder="Objet du ticket" />
                <select className="w-full p-3 border border-border rounded-lg bg-background">
                  <option>Problème technique</option>
                  <option>Question facturation</option>
                  <option>Demande de fonctionnalité</option>
                  <option>Autre</option>
                </select>
                <Textarea placeholder="Description détaillée..." className="min-h-[120px]" />
                <Button className="w-full">Créer le ticket</Button>
              </div>
            </Card>

            {/* Tickets existants */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Mes tickets</h3>
              
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">#12345 - Problème de lecture</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs">En cours</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Créé le 15 mars 2024</p>
                <p className="text-sm">Les vidéos ne se chargent pas correctement...</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">#12344 - Question abonnement</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-600 rounded-full text-xs">Résolu</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Créé le 12 mars 2024</p>
                <p className="text-sm">Comment prolonger mon abonnement ?</p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Support;