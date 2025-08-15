import { Button } from "@/components/ui/button";
import { Play, Zap } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[60vh] min-h-[400px] overflow-hidden rounded-xl mx-4 mt-4">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="StarTimes N.S - Streaming Platform"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
      </div>
      
      <div className="relative z-10 flex flex-col justify-end h-full p-6 text-white">
        <div className="max-w-lg">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Bienvenue sur <span className="text-primary">StarTimes N.S</span>
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Découvrez des milliers de chaînes TV, radios et contenus VOD en streaming HD
          </p>
          
          <div className="flex gap-3">
            <Button variant="hero" size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Commencer à regarder
            </Button>
            <Button variant="outline" size="lg" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Zap className="w-5 h-5" />
              Essai gratuit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;