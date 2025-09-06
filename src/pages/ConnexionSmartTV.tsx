import { useState, useEffect } from "react";
import { Copy, RefreshCw, Tv, Smartphone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";

const ConnexionSmartTV = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [connectCode, setConnectCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Générer un code aléatoire à 4 caractères
  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  // Générer QR Code et code de connexion
  const generateConnectionData = async () => {
    setIsLoading(true);
    const code = generateCode();
    setConnectCode(code);

    // URL de connexion avec le code
    const connectionUrl = `startimes://connect/${code}`;
    
    try {
      const qrUrl = await QRCode.toDataURL(connectionUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error("Erreur génération QR Code:", err);
      toast({
        title: "Erreur",
        description: "Impossible de générer le QR Code",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  // Copier le code dans le presse-papiers
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(connectCode);
      toast({
        title: "Code copié",
        description: "Le code a été copié dans le presse-papiers"
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le code",
        variant: "destructive"
      });
    }
  };

  // Simuler la connexion (dans un vrai projet, cela serait géré par WebSocket ou polling)
  useEffect(() => {
    if (connectCode && !isConnected) {
      const timer = setTimeout(() => {
        // Simuler une connexion réussie après 30 secondes pour la démo
        // Dans un vrai projet, cela viendrait du serveur
        const random = Math.random();
        if (random > 0.7) { // 30% de chance de connexion pour la démo
          setIsConnected(true);
          toast({
            title: "Connexion réussie !",
            description: "Votre Smart TV est maintenant connectée à votre compte"
          });
        }
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [connectCode, isConnected, toast]);

  // Générer les données au chargement initial
  useEffect(() => {
    generateConnectionData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Tv className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold text-white">Connexion Smart TV</h1>
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {!isConnected ? (
          <>
            {/* Instructions */}
            <Card className="mb-6 p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Comment connecter votre Smart TV ?
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  Ouvrez l'application StarTimes N.S sur votre Smart TV
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  Allez dans "Paramètres" puis "Connexion appareil"
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  Scannez le QR Code ou saisissez le code à 4 caractères
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  Votre compte sera automatiquement synchronisé !
                </p>
              </div>
            </Card>

            {/* QR Code Section */}
            <Card className="mb-6 p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Scannez le QR Code</h3>
              <div className="flex justify-center mb-4">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="QR Code de connexion" className="border rounded-lg" />
                ) : (
                  <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Utilisez l'appareil photo de votre Smart TV pour scanner ce code
              </p>
            </Card>

            <Separator className="mb-6" />

            {/* Code Section */}
            <Card className="mb-6 p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Ou saisissez le code</h3>
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="text-3xl font-bold tracking-widest text-primary">
                  {connectCode || "----"}
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={copyCode} variant="outline" className="flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  Copier le code
                </Button>
                <Button 
                  onClick={generateConnectionData} 
                  variant="outline" 
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Nouveau code
                </Button>
              </div>
            </Card>

            {/* Status */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                <span className="text-yellow-700 font-medium">
                  En attente de connexion...
                </span>
              </div>
              <p className="text-sm text-yellow-600 mt-2">
                Le code expire dans 10 minutes. Assurez-vous que votre Smart TV est connectée à Internet.
              </p>
            </Card>
          </>
        ) : (
          /* État connecté */
          <Card className="p-6 text-center bg-green-50 border-green-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Connexion réussie !</h2>
            <p className="text-green-600 mb-6">
              Votre Smart TV est maintenant connectée à votre compte StarTimes N.S. 
              Tous vos favoris, historique et paramètres sont synchronisés.
            </p>
            <div className="space-y-3 text-left bg-white rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Profil utilisateur synchronisé</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Chaînes favorites transférées</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Historique de visionnage disponible</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Contrôle parental appliqué</span>
              </div>
            </div>
            <Button 
              onClick={() => {
                setIsConnected(false);
                generateConnectionData();
              }}
              className="mt-6"
              variant="outline"
            >
              Connecter un autre appareil
            </Button>
          </Card>
        )}

        {/* Info supplémentaire */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Besoin d'aide ? Consultez notre guide de connexion Smart TV</p>
          <p className="mt-1">ou contactez le support technique au 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default ConnexionSmartTV;