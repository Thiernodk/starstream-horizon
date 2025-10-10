import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Channel {
  id: string;
  name: string;
  logo: string | null;
  url: string;
  category: string | null;
  tvg_id: string | null;
  group_title: string | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    url: "",
    category: "",
    tvg_id: "",
    group_title: "",
  });

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
      toast({
        title: "Accès refusé",
        description: "Vous devez être administrateur pour accéder à cette page",
        variant: "destructive",
      });
    }
  }, [isAdmin, loading, navigate, toast]);

  useEffect(() => {
    if (isAdmin) {
      loadChannels();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Administration</h1>

        <Tabs defaultValue="channels" className="w-full">
          <TabsList>
            <TabsTrigger value="channels">Chaînes TV</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="content">Contenu</TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestion des chaînes TV</CardTitle>
                    <CardDescription>
                      Ajoutez, modifiez ou supprimez des chaînes TV
                    </CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={openAddDialog}>
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter une chaîne
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          {editingChannel ? "Modifier la chaîne" : "Ajouter une chaîne"}
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
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {channel.logo && (
                          <img src={channel.logo} alt={channel.name} className="w-12 h-12 object-contain" />
                        )}
                        <div>
                          <p className="font-medium">{channel.name}</p>
                          <p className="text-sm text-muted-foreground">{channel.category}</p>
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
                  {channels.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune chaîne disponible
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>À venir...</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Gestion du contenu</CardTitle>
                <CardDescription>À venir...</CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
