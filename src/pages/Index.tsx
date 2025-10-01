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
    <div className="min-h-screen px-8 py-6">
      {/* Featured Content Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-foreground mb-6">À la Une</h2>
        <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-glow">
          <img
            src={strangerThingsPoster}
            alt="Stranger Things"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-12 text-white max-w-2xl">
            <div className="mb-3">
              <img src="https://via.placeholder.com/120x50/DC2626/FFFFFF?text=NETFLIX" alt="Netflix" className="h-8" />
            </div>
            <h3 className="text-6xl font-bold mb-6">STRANGER THINGS</h3>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Quand un garçon disparaît, une petite ville découvre un mystère impliquant des expériences secrètes.
            </p>
            <div className="flex gap-4">
              <Button variant="hero" size="lg" className="gap-3 text-lg px-8 py-6 h-auto">
                <Play className="w-6 h-6" />
                Regarder maintenant
              </Button>
              <Button variant="outline" size="lg" className="gap-3 text-lg px-8 py-6 h-auto bg-white/10 text-white border-white/30 hover:bg-white/20">
                <Info className="w-6 h-6" />
                Plus d'infos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TV Channels Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">Chaînes TV en Direct</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/tv")}
            className="text-muted-foreground hover:text-foreground gap-2 text-base"
          >
            Tout afficher
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {tvChannels.map((channel) => (
            <Card
              key={channel.id}
              className="shrink-0 w-32 h-32 p-4 bg-card border-2 border-border cursor-pointer hover:border-primary hover:scale-105 hover:shadow-glow transition-all duration-200"
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
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-foreground">Films et Séries</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/vod")}
            className="text-muted-foreground hover:text-foreground gap-2 text-base"
          >
            Tout afficher
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              className="shrink-0 w-48 aspect-[2/3] p-0 bg-transparent overflow-hidden cursor-pointer hover:scale-105 hover:shadow-glow transition-all duration-300 group"
              onClick={() => navigate("/vod")}
            >
              <div className="relative h-full">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-base font-semibold drop-shadow-lg">{movie.title}</p>
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
