import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import strangerThingsBanner from "@/assets/stranger-things-banner.jpg";
import blackPantherPoster from "@/assets/movies/black-panther.jpg";
import vikingsPoster from "@/assets/movies/vikings.jpg";

const Index = () => {
  const navigate = useNavigate();

  const tvChannels = [
    { id: "1", name: "TF1", logo: "TF1", colors: "bg-gradient-to-r from-blue-600 via-white to-red-600" },
    { id: "2", name: "France 2", logo: "2", colors: "bg-red-600" },
    { id: "3", name: "RTS1", logo: "RTS1", colors: "bg-gradient-to-r from-red-600 to-yellow-500" },
    { id: "4", name: "NCI", logo: "NCI", colors: "bg-orange-500" },
  ];

  const moviesAndSeries = [
    { id: "1", title: "Elvis", poster: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=450&fit=crop" },
    { id: "2", title: "Lucy", poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=450&fit=crop" },
    { id: "3", title: "Black Panther", poster: blackPantherPoster },
    { id: "4", title: "Vikings", poster: vikingsPoster },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Regarder - Hero Banner */}
      <section className="px-4 pt-4">
        <h2 className="text-lg font-semibold text-foreground mb-3">Regarder</h2>
        <Card 
          className="relative overflow-hidden rounded-xl cursor-pointer group"
          onClick={() => navigate("/vod")}
        >
          <div className="relative aspect-[16/10]">
            <img
              src={strangerThingsBanner}
              alt="Stranger Things"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <span className="text-red-600 font-bold text-xl tracking-wider">NETFLIX</span>
            </div>
            <div className="absolute bottom-4 left-4">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Stranger_Things_logo.png/800px-Stranger_Things_logo.png" 
                alt="Stranger Things Logo"
                className="h-12 md:h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Chaines TV */}
      <section className="px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Chaines TV</h2>
          <Button
            variant="ghost"
            onClick={() => navigate("/tv")}
            className="text-muted-foreground hover:text-foreground text-sm p-0 h-auto"
          >
            Tout afficher <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {tvChannels.map((channel) => (
            <Card
              key={channel.id}
              className="shrink-0 w-28 h-20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 bg-card/50 border-border/50"
              onClick={() => navigate("/tv")}
            >
              <div className={`w-16 h-10 ${channel.colors} rounded flex items-center justify-center`}>
                <span className="text-white font-bold text-sm">{channel.logo}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Films et séries */}
      <section className="px-4 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Films et séries</h2>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {moviesAndSeries.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-32 cursor-pointer group"
              onClick={() => navigate("/vod")}
            >
              <Card className="overflow-hidden rounded-lg mb-2 group-hover:scale-105 transition-transform duration-200">
                <div className="aspect-[2/3]">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Card>
              <p className="text-sm text-foreground font-medium truncate">{item.title}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
