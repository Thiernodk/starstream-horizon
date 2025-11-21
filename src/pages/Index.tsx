import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const recommendedContent = [
    {
      id: "1",
      title: "Le Bureau des Légendes",
      genre: "Drame, Espionnage",
      poster: "https://via.placeholder.com/280x400/4A5568/FFFFFF?text=Le+Bureau",
    },
    {
      id: "2",
      title: "Dix pour cent",
      genre: "Comédie",
      poster: "https://via.placeholder.com/280x400/059669/FFFFFF?text=Dix+pour+cent",
    },
  ];

  const popularMovies = [
    {
      id: "1",
      title: "Intouchables",
      genre: "Comédie, Drame",
      poster: "https://via.placeholder.com/200x300/F59E0B/FFFFFF?text=Intouchables",
    },
    {
      id: "2",
      title: "La Haine",
      genre: "Drame",
      poster: "https://via.placeholder.com/200x300/1F2937/FFFFFF?text=La+Haine",
    },
    {
      id: "3",
      title: "Amélie",
      genre: "Comédie, Romance",
      poster: "https://via.placeholder.com/200x300/DC2626/FFFFFF?text=Amélie",
    },
  ];

  const radios = [
    {
      id: "1",
      name: "France Inter",
      category: "Talk",
      logo: "https://via.placeholder.com/80x80/0EA5E9/FFFFFF?text=FI",
      color: "bg-blue-500",
    },
    {
      id: "2",
      name: "France Info",
      category: "News",
      logo: "https://via.placeholder.com/80x80/DC2626/FFFFFF?text=FI",
      color: "bg-red-500",
    },
    {
      id: "3",
      name: "Europe 1",
      category: "Talk",
      logo: "https://via.placeholder.com/80x80/1F2937/FFFFFF?text=E1",
      color: "bg-gray-800",
    },
    {
      id: "4",
      name: "RTL",
      category: "Talk",
      logo: "https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=RTL",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen px-4 md:px-6 py-4 md:py-6">
      {/* Header with greeting */}
      <section className="mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold text-lg md:text-2xl">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm md:text-base text-muted-foreground">Bonjour,</p>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {user?.email?.split("@")[0] || "Utilisateur"}
            </h1>
          </div>
        </div>
      </section>

      {/* Recommandé pour vous */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Recommandé pour vous</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/vod")}
            className="text-primary hover:text-primary/80 text-sm md:text-base font-semibold"
          >
            Voir plus
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {recommendedContent.map((content) => (
            <Card
              key={content.id}
              className="relative overflow-hidden cursor-pointer group hover:shadow-glow transition-all duration-300"
              onClick={() => navigate("/vod")}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
                <img
                  src={content.poster}
                  alt={content.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 rounded-full bg-black/60 hover:bg-black/80 text-white"
                >
                  <Play className="w-6 h-6 md:w-8 md:h-8 fill-white" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                  <h3 className="text-white font-bold text-sm md:text-base mb-1">
                    {content.title}
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm">{content.genre}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Films et séries populaires */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Films et séries populaires</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/vod")}
            className="text-primary hover:text-primary/80 text-sm md:text-base font-semibold"
          >
            Voir plus
          </Button>
        </div>
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {popularMovies.map((movie) => (
            <Card
              key={movie.id}
              className="shrink-0 w-32 md:w-44 overflow-hidden cursor-pointer hover:scale-105 hover:shadow-glow transition-all duration-300 group"
              onClick={() => navigate("/vod")}
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-2 md:p-3 bg-card">
                <h3 className="font-bold text-sm md:text-base text-foreground line-clamp-1 mb-1">
                  {movie.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">
                  {movie.genre}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Radios */}
      <section className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Radios</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/radios")}
            className="text-primary hover:text-primary/80 text-sm md:text-base font-semibold"
          >
            Voir plus
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {radios.map((radio) => (
            <Card
              key={radio.id}
              className="p-4 cursor-pointer hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
              onClick={() => navigate("/radios")}
            >
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl ${radio.color} flex items-center justify-center shrink-0`}>
                  <img src={radio.logo} alt={radio.name} className="w-10 h-10 md:w-12 md:h-12 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-base text-foreground truncate">
                    {radio.name}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">{radio.category}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-primary hover:text-primary/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/radios");
                  }}
                >
                  <Radio className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
