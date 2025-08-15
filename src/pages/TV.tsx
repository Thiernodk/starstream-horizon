import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChannelGrid from "@/components/ChannelGrid";
import channelsBg from "@/assets/channels-bg.jpg";

const TV = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  // Sample channels data
  const channels = [
    { id: "1", name: "CNN International", logo: "https://via.placeholder.com/48x48/DC2626/FFFFFF?text=CNN", category: "Actualités", isLive: true },
    { id: "2", name: "BBC World News", logo: "https://via.placeholder.com/48x48/1D4ED8/FFFFFF?text=BBC", category: "Actualités", isLive: true },
    { id: "3", name: "National Geographic", logo: "https://via.placeholder.com/48x48/F59E0B/FFFFFF?text=NG", category: "Documentaires" },
    { id: "4", name: "Discovery Channel", logo: "https://via.placeholder.com/48x48/059669/FFFFFF?text=DIS", category: "Documentaires" },
    { id: "5", name: "ESPN", logo: "https://via.placeholder.com/48x48/DC2626/FFFFFF?text=ESPN", category: "Sports", isLive: true },
    { id: "6", name: "MTV", logo: "https://via.placeholder.com/48x48/7C3AED/FFFFFF?text=MTV", category: "Musique" },
    { id: "7", name: "Cartoon Network", logo: "https://via.placeholder.com/48x48/F97316/FFFFFF?text=CN", category: "Enfants" },
    { id: "8", name: "HBO", logo: "https://via.placeholder.com/48x48/1F2937/FFFFFF?text=HBO", category: "Films" },
    { id: "9", name: "France 24", logo: "https://via.placeholder.com/48x48/1E40AF/FFFFFF?text=F24", category: "Actualités", isLive: true },
    { id: "10", name: "Canal+", logo: "https://via.placeholder.com/48x48/000000/FFFFFF?text=C+", category: "Films" },
    { id: "11", name: "Eurosport", logo: "https://via.placeholder.com/48x48/0EA5E9/FFFFFF?text=ES", category: "Sports" },
    { id: "12", name: "Animal Planet", logo: "https://via.placeholder.com/48x48/16A34A/FFFFFF?text=AP", category: "Documentaires" }
  ];

  const categories = ["Toutes", "Actualités", "Sports", "Films", "Documentaires", "Musique", "Enfants"];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Toutes" || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      {/* Header with background */}
      <div className="relative h-32 overflow-hidden">
        <img 
          src={channelsBg} 
          alt="Channels background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">TV en Direct</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une chaîne..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Channels grid */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {selectedCategory === "Toutes" ? "Toutes les chaînes" : selectedCategory}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredChannels.length} chaîne{filteredChannels.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <ChannelGrid 
            channels={filteredChannels}
            onChannelClick={(channel) => console.log("Playing channel:", channel.name)}
          />
        </div>
      </div>
    </div>
  );
};

export default TV;