import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, Trash2 } from "lucide-react";
import { animalsBySlug } from "@/lib/animals";
import { toast } from "sonner";

interface Fav { id: string; animal_name: string; category: string | null; }

export const Route = createFileRoute("/favorites")({
  component: FavPage,
});

function FavPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Fav[]>([]);
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/favorites" } }); }, [user, loading, navigate]);
  useEffect(() => { if (user) supabase.from("favorites").select("*").order("created_at", { ascending: false }).then(({ data }) => setItems((data as Fav[]) || [])); }, [user]);
  if (!user) return null;

  const remove = async (id: string) => {
    await supabase.from("favorites").delete().eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
    toast.success("Removed");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Home
      </Link>
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6"><Heart className="h-7 w-7 text-destructive fill-destructive" />Favorites</h1>
      {items.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No favorites yet — tap the heart on any animal to save it.</Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((f) => {
            const a = animalsBySlug[f.animal_name.toLowerCase()];
            return (
              <Card key={f.id} className="p-4 relative group">
                <button onClick={() => remove(f.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                {a ? (
                  <Link to="/animal/$slug" params={{ slug: a.slug }}>
                    <div className="aspect-square rounded-xl mb-2 grid place-items-center text-5xl" style={{ background: "var(--gradient-jungle)" }}>{a.emoji}</div>
                    <div className="font-semibold text-sm">{a.name}</div>
                  </Link>
                ) : (
                  <>
                    <div className="aspect-square rounded-xl mb-2 grid place-items-center text-3xl" style={{ background: "var(--gradient-earth)" }}>🌿</div>
                    <div className="font-semibold text-sm">{f.animal_name}</div>
                    <div className="text-xs text-muted-foreground">{f.category || "scanned"}</div>
                  </>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
