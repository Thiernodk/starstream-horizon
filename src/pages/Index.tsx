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
    <div className="min-h-screen">
      {/* Featured Content Section */}
      <section className="px-4 pt-4 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Regarder</h2>
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <img
            src={strangerThingsPoster}
            alt="Stranger Things"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="mb-2">
              <img src="https://via.placeholder.com/100x40/DC2626/FFFFFF?text=NETFLIX" alt="Netflix" className="h-6" />
            </div>
            <h3 className="text-4xl font-bold mb-4">STRANGER THINGS</h3>
            <div className="flex gap-3">
              <Button variant="hero" size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Lecture
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Info className="w-5 h-5" />
                Plus d'infos
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TV Channels Section */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Chaînes TV</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/tv")}
            className="text-white/70 hover:text-white gap-1"
          >
            Tout afficher
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {tvChannels.map((channel) => (
            <Card
              key={channel.id}
              className="shrink-0 w-20 h-20 p-2 bg-gradient-card cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate("/tv")}
            >
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-full h-full object-contain rounded"
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Movies and Series Section */}
      <section className="px-4 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Films et séries</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/vod")}
            className="text-white/70 hover:text-white gap-1"
          >
            Tout afficher
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {movies.map((movie) => (
            <Card
              key={movie.id}
              className="shrink-0 w-32 aspect-[2/3] p-0 bg-transparent overflow-hidden cursor-pointer hover:scale-105 transition-transform group"
              onClick={() => navigate("/vod")}
            >
              <div className="relative h-full">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity rounded-lg" />
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-white text-sm font-medium">{movie.title}</p>
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
