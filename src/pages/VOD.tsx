import { useState } from "react";
import { Search, Play, Star, Clock, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Vidéo à la Demande</h1>
        <p className="text-muted-foreground text-lg">
          Découvrez notre catalogue de films, séries et documentaires
        </p>
      </div>

      <div className="space-y-8">
        {/* Search and filters */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Rechercher un titre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>

          <div className="flex gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="lg"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Content grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-foreground">
              {selectedCategory === "Tous" ? "Tout le catalogue" : selectedCategory}
            </h2>
            <span className="text-base text-muted-foreground">
              {filteredContent.length} titre{filteredContent.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {filteredContent.map((content) => (
              <Card key={content.id} className="overflow-hidden group hover:shadow-glow transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => handleContentClick(content)} tabIndex={0}>
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="hero" size="icon" className="w-20 h-20">
                      <Play className="w-8 h-8" />
                    </Button>
                  </div>
                  
                  {/* Rating badge */}
                  <div className="absolute top-3 right-3 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {content.rating}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-base line-clamp-1">{content.title}</h3>
                    <Badge variant="secondary" className="ml-2 shrink-0">
                      {content.year}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{content.genre}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {content.duration}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {content.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VOD;