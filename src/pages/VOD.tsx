import { useState } from "react";
import { Search, Play, Star, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ClapprPlayer from "@/components/ClapprPlayer";

const VOD = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  const vodContent = [
    {
      id: "1",
      title: "Le Roi Lion",
      category: "Films",
      genre: "Animation",
      duration: "118 min",
      rating: 4.8,
      year: 2019,
      thumbnail: "https://via.placeholder.com/300x400/F59E0B/FFFFFF?text=Le+Roi+Lion",
      description: "Simba, un jeune lionceau, doit surmonter la tragédie et défier son oncle pour devenir roi.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },
    {
      id: "2",
      title: "Stranger Things",
      category: "Séries",
      genre: "Science-Fiction",
      duration: "8 épisodes",
      rating: 4.7,
      year: 2022,
      thumbnail: "https://via.placeholder.com/300x400/DC2626/FFFFFF?text=Stranger+Things",
      description: "Dans les années 80, des événements surnaturels bouleversent la petite ville de Hawkins.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },
    {
      id: "3",
      title: "Planète Terre II",
      category: "Documentaires",
      genre: "Nature",
      duration: "6 épisodes",
      rating: 4.9,
      year: 2016,
      thumbnail: "https://via.placeholder.com/300x400/059669/FFFFFF?text=Planète+Terre",
      description: "Une exploration spectaculaire de la nature sauvage de notre planète.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    {
      id: "4",
      title: "Avengers: Endgame",
      category: "Films",
      genre: "Action",
      duration: "181 min",
      rating: 4.6,
      year: 2019,
      thumbnail: "https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=Avengers",
      description: "Les Avengers tentent de défaire les dégâts causés par Thanos dans Infinity War.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
      id: "5",
      title: "The Crown",
      category: "Séries",
      genre: "Drame",
      duration: "10 épisodes",
      rating: 4.5,
      year: 2023,
      thumbnail: "https://via.placeholder.com/300x400/1D4ED8/FFFFFF?text=The+Crown",
      description: "L'histoire de la reine Elizabeth II et de la famille royale britannique.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    {
      id: "6",
      title: "Cosmos",
      category: "Documentaires",
      genre: "Science",
      duration: "13 épisodes",
      rating: 4.8,
      year: 2014,
      thumbnail: "https://via.placeholder.com/300x400/0EA5E9/FFFFFF?text=Cosmos",
      description: "Un voyage à travers l'espace et le temps pour explorer l'univers.",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    }
  ];

  const categories = ["Tous", "Films", "Séries", "Documentaires"];

  const filteredContent = vodContent.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
    setShowPlayer(true);
  };

  if (showPlayer && selectedContent) {
    return (
      <ClapprPlayer
        src={selectedContent.videoUrl}
        title={selectedContent.title}
        poster={selectedContent.thumbnail}
        onBack={() => setShowPlayer(false)}
        metadata={{
          category: selectedContent.genre,
          description: selectedContent.description,
        }}
        autoplay={false}
        controls={true}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 py-4 pb-24">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground">VOD</h1>
        <p className="text-muted-foreground text-sm">Films, séries et documentaires</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      {/* Categories - horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="whitespace-nowrap shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">
          {selectedCategory === "Tous" ? "Catalogue" : selectedCategory}
        </h2>
        <span className="text-xs text-muted-foreground">
          {filteredContent.length} titre{filteredContent.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Content grid - mobile optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filteredContent.map((content) => (
          <Card 
            key={content.id} 
            className="overflow-hidden group hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => handleContentClick(content)}
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="w-10 h-10 text-white" />
              </div>
              
              {/* Rating */}
              <div className="absolute top-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {content.rating}
              </div>
            </div>

            <div className="p-2">
              <h3 className="font-medium text-sm line-clamp-1">{content.title}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <span>{content.genre}</span>
                <span>•</span>
                <span>{content.year}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VOD;
