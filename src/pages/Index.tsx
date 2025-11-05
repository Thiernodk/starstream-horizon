import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Info, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import strangerThingsPoster from "@/assets/stranger-things-poster.jpg";

const Index = () => {
  const navigate = useNavigate();

  const tvChannels = [
    { id: "1", name: "TF1", logo: "https://via.placeholder.com/80x80/DC2626/FFFFFF?text=TF1" },
    { id: "2", name: "France 2", logo: "https://via.placeholder.com/80x80/1D4ED8/FFFFFF?text=F2" },
    { id: "3", name: "RTS 1", logo: "https://via.placeholder.com/80x80/DC2626/FFFFFF?text=RTS" },
    { id: "4", name: "Canal+", logo: "https://via.placeholder.com/80x80/000000/FFFFFF?text=C+" },
    { id: "5", name: "M6", logo: "https://via.placeholder.com/80x80/7C3AED/FFFFFF?text=M6" },
  ];

  const movies = [
    {
      id: "1",
      title: "Elvis",
      poster: "https://via.placeholder.com/200x300/F59E0B/FFFFFF?text=ELVIS",
    },
    {
      id: "2",
      title: "Lucy",
      poster: "https://via.placeholder.com/200x300/6B7280/FFFFFF?text=LUCY",
    },
    {
      id: "3", 
      title: "Black Panther",
      poster: "https://via.placeholder.com/200x300/059669/FFFFFF?text=BP",
    },
    {
      id: "4",
      title: "Avatar",
      poster: "https://via.placeholder.com/200x300/0EA5E9/FFFFFF?text=AVATAR",
    },
  ];

  return (
    <div className="min-h-screen px-4 md:px-8 py-4 md:py-6">
      {/* Featured Content Section */}
      <section className="mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 md:mb-6">À la Une</h2>
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-2xl overflow-hidden shadow-glow">
          <img
            src={strangerThingsPoster}
            alt="Stranger Things"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-4 md:p-12 text-white max-w-2xl">
            <div className="mb-2 md:mb-3">
              <img src="https://via.placeholder.com/120x50/DC2626/FFFFFF?text=NETFLIX" alt="Netflix" className="h-5 md:h-8" />
            </div>
            <h3 className="text-2xl md:text-6xl font-bold mb-2 md:mb-6">STRANGER THINGS</h3>
            <p className="text-sm md:text-lg text-white/90 mb-4 md:mb-8 leading-relaxed line-clamp-2 md:line-clamp-none">
              Quand un garçon disparaît, une petite ville découvre un mystère impliquant des expériences secrètes.
            </p>
            <div className="flex gap-2 md:gap-4">
              <Button variant="hero" size="sm" className="gap-2 text-sm md:text-lg md:px-8 md:py-6 md:h-auto">
                <Play className="w-4 h-4 md:w-6 md:h-6" />
                <span className="hidden md:inline">Regarder maintenant</span>
                <span className="md:hidden">Regarder</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-sm md:text-lg md:px-8 md:py-6 md:h-auto bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Info className="w-4 h-4 md:w-6 md:h-6" />
                <span className="hidden md:inline">Plus d'infos</span>
                <span className="md:hidden">Info</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TV Channels Section */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-foreground">Chaînes TV en Direct</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/tv")}
            className="text-muted-foreground hover:text-foreground gap-1 md:gap-2 text-sm md:text-base"
          >
            <span className="hidden md:inline">Tout afficher</span>
            <span className="md:hidden">Tout</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
        <div className="flex gap-3 md:gap-6 overflow-x-auto pb-4">
          {tvChannels.map((channel) => (
            <Card
              key={channel.id}
              className="shrink-0 w-20 h-20 md:w-32 md:h-32 p-2 md:p-4 bg-card border-2 border-border cursor-pointer hover:border-primary hover:scale-105 hover:shadow-glow transition-all duration-200"
              onClick={() => navigate("/tv")}
            >
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-contain"
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Movies and Series Section */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-3xl font-bold text-foreground">Films et Séries</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/vod")}
            className="text-muted-foreground hover:text-foreground gap-1 md:gap-2 text-sm md:text-base"
          >
            <span className="hidden md:inline">Tout afficher</span>
            <span className="md:hidden">Tout</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
        <div className="flex gap-3 md:gap-6 overflow-x-auto pb-4">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              className="shrink-0 w-32 md:w-48 aspect-[2/3] p-0 bg-transparent overflow-hidden cursor-pointer hover:scale-105 hover:shadow-glow transition-all duration-300 group"
              onClick={() => navigate("/vod")}
            >
              <div className="relative h-full">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
                  <p className="text-white text-sm md:text-base font-semibold drop-shadow-lg">{movie.title}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
