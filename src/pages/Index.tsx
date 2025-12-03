import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import strangerThingsBanner from "@/assets/stranger-things-banner.jpg";

interface Channel {
  id: string;
  name: string;
  logo: string | null;
  url: string;
  category: string | null;
}

interface VODContent {
  id: string;
  title: string;
  thumbnail: string | null;
  category: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [vodContents, setVodContents] = useState<VODContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      
      // Load channels from Supabase
      const { data: channelsData } = await supabase
        .from("channels")
        .select("id, name, logo, url, category")
        .limit(4);
      
      if (channelsData) {
        setChannels(channelsData);
      }

      // Load VOD contents from Supabase
      const { data: vodData } = await supabase
        .from("vod_contents")
        .select("id, title, thumbnail, category")
        .order("order_position")
        .limit(6);
      
      if (vodData) {
        setVodContents(vodData);
      }

      setLoading(false);
    };

    loadContent();

    // Subscribe to changes for real-time updates
    const channelsSubscription = supabase
      .channel('homepage_channels')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'channels' }, () => {
        loadContent();
      })
      .subscribe();

    const vodSubscription = supabase
      .channel('homepage_vod')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vod_contents' }, () => {
        loadContent();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelsSubscription);
      supabase.removeChannel(vodSubscription);
    };
  }, []);

  // Generate color based on channel name for visual variety
  const getChannelColor = (name: string) => {
    const colors = [
      "bg-gradient-to-r from-blue-600 via-white to-red-600",
      "bg-red-600",
      "bg-gradient-to-r from-red-600 to-yellow-500",
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-600",
      "bg-purple-600",
      "bg-pink-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

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
        
        {loading ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shrink-0 w-28 h-20 bg-card/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : channels.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {channels.map((channel) => (
              <Card
                key={channel.id}
                className="shrink-0 w-28 h-20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 bg-card/50 border-border/50"
                onClick={() => navigate("/tv")}
              >
                {channel.logo ? (
                  <img 
                    src={channel.logo} 
                    alt={channel.name}
                    className="w-16 h-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`w-16 h-10 ${getChannelColor(channel.name)} rounded flex items-center justify-center ${channel.logo ? 'hidden' : ''}`}>
                  <span className="text-white font-bold text-xs">{channel.name.slice(0, 4).toUpperCase()}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucune chaîne disponible</p>
            <p className="text-sm">Ajoutez des chaînes depuis l'interface administrateur</p>
          </div>
        )}
      </section>

      {/* Films et séries */}
      <section className="px-4 mt-8">
        <h2 className="text-lg font-semibold text-foreground mb-3">Films et séries</h2>
        
        {loading ? (
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="shrink-0 w-32 h-48 bg-card/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : vodContents.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {vodContents.map((item) => (
              <div
                key={item.id}
                className="shrink-0 w-32 cursor-pointer group"
                onClick={() => navigate("/vod")}
              >
                <Card className="overflow-hidden rounded-lg mb-2 group-hover:scale-105 transition-transform duration-200">
                  <div className="aspect-[2/3] bg-card/50">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/128x192/1f2937/ffffff?text=${encodeURIComponent(item.title.slice(0, 2))}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        <span className="text-foreground font-bold text-lg">{item.title.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
                </Card>
                <p className="text-sm text-foreground font-medium truncate">{item.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Aucun contenu disponible</p>
            <p className="text-sm">Ajoutez des contenus VOD depuis l'interface administrateur</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
