import { useState } from "react";
import { Search, Play, Pause, Volume2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Radios = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);

  const radios = [
    { id: "1", name: "France Inter", genre: "Généraliste", country: "France", frequency: "87.8 FM" },
    { id: "2", name: "RTL", genre: "Généraliste", country: "France", frequency: "104.3 FM" },
    { id: "3", name: "NRJ", genre: "Musique", country: "France", frequency: "100.3 FM" },
    { id: "4", name: "Skyrock", genre: "Musique", country: "France", frequency: "96.0 FM" },
    { id: "5", name: "RFI", genre: "International", country: "France", frequency: "89.0 FM" },
    { id: "6", name: "Jazz Radio", genre: "Jazz", country: "France", frequency: "92.7 FM" },
    { id: "7", name: "Nostalgie", genre: "Rétro", country: "France", frequency: "90.4 FM" },
    { id: "8", name: "Fun Radio", genre: "Musique", country: "France", frequency: "101.9 FM" },
    { id: "9", name: "Europe 1", genre: "Généraliste", country: "France", frequency: "104.7 FM" },
    { id: "10", name: "Radio Classique", genre: "Classique", country: "France", frequency: "101.1 FM" }
  ];

  const genres = ["Tous", "Généraliste", "Musique", "International", "Jazz", "Rétro", "Classique"];

  const filteredRadios = radios.filter(radio => {
    const matchesSearch = radio.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "Tous" || radio.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handlePlayPause = (radioId: string) => {
    if (currentlyPlaying === radioId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(radioId);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative h-32 bg-gradient-hero flex items-center justify-center">
        <h1 className="text-3xl font-bold text-white">Radios</h1>
      </div>

      <div className="px-4 py-6">
        {/* Search and filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher une radio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
                className="whitespace-nowrap"
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {/* Currently playing */}
        {currentlyPlaying && (
          <Card className="mb-6 p-4 bg-gradient-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">En cours de lecture</h3>
                <p className="text-sm opacity-90">
                  {radios.find(r => r.id === currentlyPlaying)?.name}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 animate-pulse" />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentlyPlaying(null)}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <Pause className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Radio list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {selectedGenre === "Tous" ? "Toutes les radios" : selectedGenre}
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredRadios.length} radio{filteredRadios.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredRadios.map((radio) => (
            <Card key={radio.id} className="p-4 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-card rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-primary rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{radio.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{radio.genre}</span>
                      <span>•</span>
                      <span>{radio.frequency}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant={currentlyPlaying === radio.id ? "default" : "outline"}
                  size="icon"
                  onClick={() => handlePlayPause(radio.id)}
                  className="shrink-0"
                >
                  {currentlyPlaying === radio.id ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Radios;