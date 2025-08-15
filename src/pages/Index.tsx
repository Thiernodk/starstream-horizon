import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import { Tv, Radio, Video, Clock, Star, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "TV en Direct",
      description: "Plus de 500 chaînes",
      icon: Tv,
      gradient: "from-primary to-primary-glow",
      onClick: () => navigate("/tv")
    },
    {
      title: "Radios",
      description: "Musique & Talk shows",
      icon: Radio,
      gradient: "from-purple-600 to-purple-400",
      onClick: () => navigate("/radios")
    },
    {
      title: "VOD",
      description: "Films & Séries",
      icon: Video,
      gradient: "from-green-600 to-green-400",
      onClick: () => navigate("/vod")
    },
    {
      title: "Replay",
      description: "Programmes manqués",
      icon: Clock,
      gradient: "from-orange-600 to-orange-400",
      onClick: () => {}
    },
    {
      title: "Favoris",
      description: "Vos contenus préférés",
      icon: Star,
      gradient: "from-yellow-600 to-yellow-400",
      onClick: () => {}
    },
    {
      title: "Premium",
      description: "Contenu exclusif",
      icon: Zap,
      gradient: "from-red-600 to-red-400",
      onClick: () => {}
    }
  ];

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Découvrir</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.title}
              title={category.title}
              description={category.description}
              icon={category.icon}
              gradient={category.gradient}
              onClick={category.onClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
