import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecked, setAdminChecked] = useState(false);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer Supabase calls with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            checkAdminStatus(session.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
          setAdminChecked(true);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkAdminStatus(session.user.id);
      } else {
        setAdminChecked(true);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminChecked(true);
        return;
      }

      setIsAdmin(!!data);
      setAdminChecked(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setAdminChecked(true);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      toast.success("Compte créé avec succès");
      toast.info("Bienvenue sur N.S Stream!");

      // Force immediate redirect on successful signup
      if (data.user) {
        window.location.href = "/";
      }

      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || "Impossible de créer le compte");
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Connexion réussie");
      toast.info("Bon retour!");

      // Force immediate redirect on successful login
      if (data.user) {
        window.location.href = "/";
      }

      return { data, error: null };
    } catch (error: any) {
      toast.error(error.message || "Email ou mot de passe incorrect");
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success("Déconnexion réussie");
    } catch (error: any) {
      toast.error(error.message || "Impossible de se déconnecter");
    }
  };

  return {
    user,
    session,
    loading,
    isAdmin,
    adminChecked,
    signUp,
    signIn,
    signOut,
  };
};
