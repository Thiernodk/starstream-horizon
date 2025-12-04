import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Trash2, Plus, Edit, MoveUp, MoveDown, LayoutDashboard, Tv, Radio, 
  CreditCard, Users, Settings, Menu, X, ChevronRight, Eye, TrendingUp
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Channel {
  id: string;
  name: string;
  logo: string | null;
  url: string;
  category: string | null;
  tvg_id: string | null;
  group_title: string | null;
}

interface VODContent {
  id: string;
  title: string;
  url: string;
  description: string | null;
  thumbnail: string | null;
  category: string;
  order_position: number;
  created_at: string;
  updated_at: string;
}

type AdminSection = "dashboard" | "channels" | "radios" | "vod" | "subscriptions" | "users" | "settings";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, adminChecked } = useAuth();
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // VOD state
  const [vodContents, setVodContents] = useState<VODContent[]>([]);
  const [isVodDialogOpen, setIsVodDialogOpen] = useState(false);
  const [editingVod, setEditingVod] = useState<VODContent | null>(null);
  
  // Form state for channels
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    url: "",
    category: "",
    tvg_id: "",
    group_title: "",
  });

  // Form state for VOD
  const [vodFormData, setVodFormData] = useState({
    title: "",
    url: "",
    description: "",
    thumbnail: "",
    category: "ACADEMY TV",
  });

  const menuItems = [
    { id: "dashboard" as AdminSection, label: "Tableau de bord", icon: LayoutDashboard },
    { id: "channels" as AdminSection, label: "Chaînes TV", icon: Tv },
    { id: "radios" as AdminSection, label: "Radios", icon: Radio },
    { id: "vod" as AdminSection, label: "ACADEMY TV", icon: Eye },
    { id: "subscriptions" as AdminSection, label: "Abonnements", icon: CreditCard },
    { id: "users" as AdminSection, label: "Utilisateurs", icon: Users },
    { id: "settings" as AdminSection, label: "Paramètres", icon: Settings },
  ];

  useEffect(() => {
    if (!loading && adminChecked) {
      if (!user) {
        navigate("/auth");
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour accéder à cette page",
          variant: "destructive",
        });
      } else if (!isAdmin) {
        navigate("/");
        toast({
          title: "Accès refusé",
          description: "Vous devez être administrateur pour accéder à cette page",
          variant: "destructive",
        });
      }
    }
  }, [user, isAdmin, loading, adminChecked, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadChannels();
      loadVodContents();
    }
  }, [isAdmin]);

  const loadChannels = async () => {
    const { data, error } = await supabase
      .from("channels")
      .select("*")
      .order("name");

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les chaînes",
        variant: "destructive",
      });
      return;
    }

    setChannels(data || []);
  };

  const loadVodContents = async () => {
    const { data, error } = await supabase
      .from("vod_contents")
      .select("*")
      .order("order_position");

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les contenus VOD",
        variant: "destructive",
      });
      return;
    }

    setVodContents(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingChannel) {
      const { error } = await supabase
        .from("channels")
        .update(formData)
        .eq("id", editingChannel.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier la chaîne",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Chaîne modifiée",
        description: "La chaîne a été modifiée avec succès",
      });
    } else {
      const { error } = await supabase
        .from("channels")
        .insert(formData);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la chaîne",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Chaîne ajoutée",
        description: "La chaîne a été ajoutée avec succès",
      });
    }

    setIsDialogOpen(false);
    setEditingChannel(null);
    setFormData({
      name: "",
      logo: "",
      url: "",
      category: "",
      tvg_id: "",
      group_title: "",
    });
    loadChannels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette chaîne ?")) {
      return;
    }

    const { error } = await supabase
      .from("channels")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la chaîne",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Chaîne supprimée",
      description: "La chaîne a été supprimée avec succès",
    });

    loadChannels();
  };

  const handleVodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVod) {
      const { error } = await supabase
        .from("vod_contents")
        .update(vodFormData)
        .eq("id", editingVod.id);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de modifier le contenu VOD",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Contenu modifié",
        description: "Le contenu VOD a été modifié avec succès",
      });
    } else {
      const maxOrder = vodContents.reduce((max, vod) => Math.max(max, vod.order_position), -1);
      
      const { error } = await supabase
        .from("vod_contents")
        .insert({ ...vodFormData, order_position: maxOrder + 1 });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le contenu VOD",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Contenu ajouté",
        description: "Le contenu VOD a été ajouté avec succès",
      });
    }

    setIsVodDialogOpen(false);
    setEditingVod(null);
    setVodFormData({
      title: "",
      url: "",
      description: "",
      thumbnail: "",
      category: "ACADEMY TV",
    });
    loadVodContents();
  };

  const handleVodDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce contenu VOD ?")) {
      return;
    }

    const { error } = await supabase
      .from("vod_contents")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le contenu VOD",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Contenu supprimé",
      description: "Le contenu VOD a été supprimé avec succès",
    });
    loadVodContents();
  };

  const moveVodUp = async (vod: VODContent) => {
    const currentIndex = vodContents.findIndex(v => v.id === vod.id);
    if (currentIndex === 0) return;

    const prevVod = vodContents[currentIndex - 1];
    
    await supabase
      .from("vod_contents")
      .update({ order_position: prevVod.order_position })
      .eq("id", vod.id);

    await supabase
      .from("vod_contents")
      .update({ order_position: vod.order_position })
      .eq("id", prevVod.id);

    loadVodContents();
  };

  const moveVodDown = async (vod: VODContent) => {
    const currentIndex = vodContents.findIndex(v => v.id === vod.id);
    if (currentIndex === vodContents.length - 1) return;

    const nextVod = vodContents[currentIndex + 1];
    
    await supabase
      .from("vod_contents")
      .update({ order_position: nextVod.order_position })
      .eq("id", vod.id);

    await supabase
      .from("vod_contents")
      .update({ order_position: vod.order_position })
      .eq("id", nextVod.id);

    loadVodContents();
  };

  const openEditDialog = (channel: Channel) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      logo: channel.logo || "",
      url: channel.url,
      category: channel.category || "",
      tvg_id: channel.tvg_id || "",
      group_title: channel.group_title || "",
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingChannel(null);
    setFormData({
      name: "",
      logo: "",
      url: "",
      category: "",
      tvg_id: "",
      group_title: "",
    });
    setIsDialogOpen(true);
  };

  const openVodEditDialog = (vod: VODContent) => {
    setEditingVod(vod);
    setVodFormData({
      title: vod.title,
      url: vod.url,
      description: vod.description || "",
      thumbnail: vod.thumbnail || "",
      category: vod.category,
    });
    setIsVodDialogOpen(true);
  };

  const openVodAddDialog = () => {
    setEditingVod(null);
    setVodFormData({
      title: "",
      url: "",
      description: "",
      thumbnail: "",
      category: "ACADEMY TV",
    });
    setIsVodDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const tvChannels = channels.filter(c => !c.category?.toLowerCase().includes("radio"));
  const radioChannels = channels.filter(c => c.category?.toLowerCase().includes("radio"));

  const renderDashboard = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble de votre plateforme N.S Stream</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chaînes TV</p>
                <p className="text-3xl font-bold text-foreground">{tvChannels.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Tv className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>Actives</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Radios</p>
                <p className="text-3xl font-bold text-foreground">{radioChannels.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Radio className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="h-3 w-3" />
              <span>En ligne</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Contenus VOD</p>
                <p className="text-3xl font-bold text-foreground">{vodContents.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-warning" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>ACADEMY TV</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Abonnements</p>
                <p className="text-3xl font-bold text-foreground">0</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-success" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <span>À configurer</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tv className="h-5 w-5 text-primary" />
              Dernières chaînes ajoutées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tvChannels.slice(0, 5).map((channel) => (
                <div key={channel.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  {channel.logo && (
                    <img src={channel.logo} alt={channel.name} className="w-10 h-10 object-contain rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{channel.name}</p>
                    <p className="text-xs text-muted-foreground">{channel.category || "Sans catégorie"}</p>
                  </div>
                </div>
              ))}
              {tvChannels.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Aucune chaîne</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-warning" />
              Derniers contenus VOD
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vodContents.slice(0, 5).map((vod) => (
                <div key={vod.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  {vod.thumbnail && (
                    <img src={vod.thumbnail} alt={vod.title} className="w-14 h-10 object-cover rounded" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{vod.title}</p>
                    <p className="text-xs text-muted-foreground">{vod.category}</p>
                  </div>
                </div>
              ))}
              {vodContents.length === 0 && (
                <p className="text-center text-muted-foreground py-4">Aucun contenu VOD</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderChannels = (channelList: Channel[], title: string, isRadio: boolean = false) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{channelList.length} {isRadio ? "radios" : "chaînes"} disponibles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingChannel ? "Modifier" : "Ajouter"} une {isRadio ? "radio" : "chaîne"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={isRadio ? "Radio" : "TV"}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL du stream *</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">URL du logo</Label>
                <Input
                  id="logo"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tvg_id">TVG ID</Label>
                  <Input
                    id="tvg_id"
                    value={formData.tvg_id}
                    onChange={(e) => setFormData({ ...formData, tvg_id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group_title">Groupe</Label>
                  <Input
                    id="group_title"
                    value={formData.group_title}
                    onChange={(e) => setFormData({ ...formData, group_title: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingChannel ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {channelList.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {channel.logo ? (
                    <img src={channel.logo} alt={channel.name} className="w-12 h-12 object-contain rounded-lg bg-muted p-1" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      {isRadio ? <Radio className="w-6 h-6 text-muted-foreground" /> : <Tv className="w-6 h-6 text-muted-foreground" />}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{channel.name}</p>
                    <p className="text-sm text-muted-foreground">{channel.category || "Sans catégorie"}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openEditDialog(channel)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(channel.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {channelList.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                Aucune {isRadio ? "radio" : "chaîne"} disponible
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVOD = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ACADEMY TV</h2>
          <p className="text-muted-foreground">{vodContents.length} contenus VOD disponibles</p>
        </div>
        <Dialog open={isVodDialogOpen} onOpenChange={setIsVodDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openVodAddDialog} className="gap-2">
              <Plus className="w-4 h-4" />
              Ajouter un contenu
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingVod ? "Modifier" : "Ajouter"} un contenu VOD</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleVodSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vod-title">Titre *</Label>
                <Input
                  id="vod-title"
                  value={vodFormData.title}
                  onChange={(e) => setVodFormData({ ...vodFormData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vod-url">URL du contenu VOD (iframe embed) *</Label>
                <Input
                  id="vod-url"
                  value={vodFormData.url}
                  onChange={(e) => setVodFormData({ ...vodFormData, url: e.target.value })}
                  placeholder="https://iframe.dacast.com/..."
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL d'embed des plateformes comme Dacast, Castr, etc.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vod-description">Description</Label>
                <Textarea
                  id="vod-description"
                  value={vodFormData.description}
                  onChange={(e) => setVodFormData({ ...vodFormData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vod-thumbnail">URL de la miniature</Label>
                <Input
                  id="vod-thumbnail"
                  value={vodFormData.thumbnail}
                  onChange={(e) => setVodFormData({ ...vodFormData, thumbnail: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vod-category">Catégorie</Label>
                <Input
                  id="vod-category"
                  value={vodFormData.category}
                  onChange={(e) => setVodFormData({ ...vodFormData, category: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsVodDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingVod ? "Modifier" : "Ajouter"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {vodContents.map((vod, index) => (
              <div
                key={vod.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  {vod.thumbnail ? (
                    <img src={vod.thumbnail} alt={vod.title} className="w-20 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-20 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Eye className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{vod.title}</p>
                    {vod.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1">{vod.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{vod.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveVodUp(vod)}
                    disabled={index === 0}
                    title="Monter"
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => moveVodDown(vod)}
                    disabled={index === vodContents.length - 1}
                    title="Descendre"
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => openVodEditDialog(vod)}
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleVodDelete(vod.id)}
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {vodContents.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                Aucun contenu VOD disponible
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlaceholder = (title: string, description: string) => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Cette fonctionnalité sera bientôt disponible</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return renderDashboard();
      case "channels":
        return renderChannels(tvChannels, "Chaînes TV");
      case "radios":
        return renderChannels(radioChannels, "Radios", true);
      case "vod":
        return renderVOD();
      case "subscriptions":
        return renderPlaceholder("Abonnements", "Gérez les abonnements et les paiements");
      case "users":
        return renderPlaceholder("Utilisateurs", "Gérez les utilisateurs de la plateforme");
      case "settings":
        return renderPlaceholder("Paramètres", "Configurez les paramètres de la plateforme");
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-0 lg:w-16"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Tv className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">N.S Stream</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeSection === item.id && <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* User info */}
        {sidebarOpen && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Administration</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Retour au site
          </Button>
        </header>

        {/* Content */}
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Admin;
