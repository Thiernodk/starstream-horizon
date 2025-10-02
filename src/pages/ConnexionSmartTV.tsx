import { useState, useEffect, useRef } from "react";
import { Camera, Tv, Smartphone, CheckCircle, ScanLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import QrScanner from "qr-scanner";

const ConnexionSmartTV = () => {
  const [inputCode, setInputCode] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const { toast } = useToast();

  // Démarrer le scanner QR
  const startQRScanner = async () => {
    if (!videoRef.current) return;
    
    setIsScanning(true);
    try {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleQRCodeScanned(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      await scannerRef.current.start();
    } catch (err) {
      console.error("Erreur scanner QR:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
      setIsScanning(false);
    }
  };

  // Arrêter le scanner QR
  const stopQRScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Traiter le QR code scanné
  const handleQRCodeScanned = (data: string) => {
    stopQRScanner();
    if (data.startsWith('nsstream://share/')) {
      const code = data.replace('nsstream://share/', '');
      connectWithCode(code);
    } else {
      toast({
        title: "QR Code invalide",
        description: "Ce QR Code ne provient pas de l'application N.S Stream Smart TV",
        variant: "destructive"
      });
    }
  };

  // Connecter avec le code saisi
  const connectWithCode = async (code: string) => {
    if (!code || code.length !== 4) {
      toast({
        title: "Code invalide",
        description: "Le code doit contenir exactement 4 caractères",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      // Simuler la connexion avec l'app Smart TV
      // Dans un vrai projet, cela ferait un appel API pour valider le code
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsConnected(true);
      toast({
        title: "Connexion réussie !",
        description: "Votre compte a été partagé avec l'application Smart TV"
      });
    } catch (err) {
      toast({
        title: "Erreur de connexion",
        description: "Code invalide ou expiré",
        variant: "destructive"
      });
    }
    setIsConnecting(false);
  };

  // Gérer la saisie manuelle du code
  const handleManualConnect = () => {
    connectWithCode(inputCode);
  };

  // Nettoyer le scanner au démontage
  useEffect(() => {
    return () => {
      stopQRScanner();
    };
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
                Comment partager votre compte ?
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                  Ouvrez l'application N.S Stream sur votre Smart TV (Bolt IA)
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                  Allez dans "Paramètres" puis "Partage de compte"
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                  Générez un QR Code ou copiez le code à 4 caractères
                </p>
                <p className="flex items-start gap-2">
                  <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                  Scannez le QR Code ou collez le code ci-dessous
                </p>
              </div>
            </Card>

            {/* Scanner QR Code */}
            <Card className="mb-6 p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Scanner le QR Code</h3>
              <div className="flex justify-center mb-4">
                {isScanning ? (
                  <div className="relative">
                    <video 
                      ref={videoRef}
                      className="w-64 h-64 bg-black rounded-lg"
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg">
                      <ScanLine className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-muted rounded-lg flex flex-col items-center justify-center">
                    <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">Caméra prête</p>
                  </div>
                )}
              </div>
              <Button 
                onClick={isScanning ? stopQRScanner : startQRScanner}
                className="mb-2"
              >
                {isScanning ? "Arrêter le scan" : "Commencer le scan"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Scannez le QR Code généré par l'application Smart TV
              </p>
            </Card>

            <Separator className="mb-6" />

            {/* Saisie manuelle du code */}
            <Card className="mb-6 p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">Ou saisissez le code manuellement</h3>
              <div className="max-w-xs mx-auto mb-4">
                <Input
                  placeholder="Code à 4 caractères"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase().slice(0, 4))}
                  className="text-center text-2xl font-bold tracking-widest"
                  maxLength={4}
                />
              </div>
              <Button 
                onClick={handleManualConnect} 
                disabled={inputCode.length !== 4 || isConnecting}
                className="flex items-center gap-2"
              >
                {isConnecting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : null}
                Se connecter
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Copiez le code depuis l'application Smart TV
              </p>
            </Card>

            {/* Status */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-blue-700 font-medium">
                  Prêt à recevoir le partage de compte
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Générez un code depuis votre Smart TV et scannez-le ou saisissez-le ci-dessus.
              </p>
            </Card>
          </>
        ) : (
          /* État connecté */
          <Card className="p-6 text-center bg-green-50 border-green-200">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Partage réussi !</h2>
            <p className="text-green-600 mb-6">
              Votre compte a été partagé avec l'application Smart TV. 
              Tous vos favoris, historique et paramètres sont maintenant disponibles.
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
                setInputCode("");
              }}
              className="mt-6"
              variant="outline"
            >
              Partager avec un autre appareil
            </Button>
          </Card>
        )}

        {/* Info supplémentaire */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Besoin d'aide ? Consultez notre guide de partage de compte Smart TV</p>
          <p className="mt-1">ou contactez le support technique au 24/7</p>
        </div>
      </div>
    </div>
  );
};

export default ConnexionSmartTV;