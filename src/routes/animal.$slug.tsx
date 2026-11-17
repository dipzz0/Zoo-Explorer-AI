import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { animalsBySlug } from "@/lib/animals";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AiChatPanel } from "@/components/AiChatPanel";

export const Route = createFileRoute("/animal/$slug")({
  component: AnimalPage,
});

function AnimalPage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const animal = animalsBySlug[slug];
  const [extended, setExtended] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favoriting, setFavoriting] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: `/animal/${slug}` } }); }, [user, loading, navigate, slug]);

  useEffect(() => {
    if (!user || !animal) return;
    supabase.from("favorites").select("id").eq("user_id", user.id).eq("animal_name", animal.name).maybeSingle()
      .then(({ data }) => setIsFav(!!data));
  }, [user, animal]);

  if (!user) return null;
  if (!animal) return <div className="p-8 text-center">Animal not found. <Link to="/" className="text-primary underline">Home</Link></div>;

  const toggleFav = async () => {
    setFavoriting(true);
    try {
      if (isFav) {
        await supabase.from("favorites").delete().eq("user_id", user.id).eq("animal_name", animal.name);
        setIsFav(false);
        toast.success("Removed from favorites");
      } else {
        await supabase.from("favorites").insert({ user_id: user.id, animal_name: animal.name, category: animal.category });
        setIsFav(true);
        toast.success("Added to favorites ❤️");
      }
    } finally { setFavoriting(false); }
  };

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const { data, error } = await supabase.functions.invoke("recognize", {
        body: { imageBase64: undefined, mode: "extended", textOnly: animal.name },
      });
      // The edge function expects an image; instead, use a local extended description.
      // Compose a richer profile from the static dataset:
      const richer = [
        `${animal.name} (${animal.species}) thrives in ${animal.habitat}. As a ${animal.diet.toLowerCase()}, it plays a vital role in its ecosystem.`,
        ...animal.facts.map((f) => `• ${f}`),
        `Conservation note: many populations face habitat loss and require active protection.`,
      ].join("\n\n");
      setExtended(richer);
    } catch (e) {
      toast.error("Couldn't load extended details");
    } finally { setLoadingMore(false); }
  };

  const pageBg = "linear-gradient(180deg, color-mix(in oklab, " + animal.accent + " 18%, transparent) 0%, transparent 40%)";
  const heroOverlay = "linear-gradient(180deg, transparent 40%, color-mix(in oklab, " + animal.accent + " 75%, black) 100%)";

  return (
    <div className="min-h-screen" style={{ background: pageBg }}>
      <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/category/$slug" params={{ slug: animal.category }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Back
      </Link>

      <div className="relative rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] mb-6 aspect-[16/10]">
        <img src={animal.image} alt={animal.name} width={1200} height={750} loading="eager" decoding="async" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: heroOverlay }} />
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <div className="inline-block text-xs uppercase tracking-[0.2em] font-semibold px-2 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-2">{animal.category}</div>
          <div className="text-2xl font-bold drop-shadow italic opacity-90">{animal.species}</div>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: animal.accent }}>{animal.name}</h1>
          <div className="italic text-muted-foreground">{animal.species}</div>
        </div>
        <Button onClick={toggleFav} disabled={favoriting} variant="outline" size="icon" className="rounded-full">
          <Heart className={isFav ? "h-5 w-5 fill-destructive text-destructive" : "h-5 w-5"} />
        </Button>
      </div>

      <p className="text-foreground/90 mb-6">{animal.summary}</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <InfoRow label="Habitat" value={animal.habitat} />
        <InfoRow label="Diet" value={animal.diet} />
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 font-semibold mb-3"><Sparkles className="h-4 w-4 text-primary" />Interesting facts</div>
        <ul className="space-y-2 text-sm">
          {animal.facts.map((f, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{f}</li>)}
        </ul>
      </Card>

      <div className="flex gap-2 mt-6">
        <Button onClick={() => setChatOpen(o => !o)} className="flex-1 h-12 rounded-full" style={{ background: "var(--gradient-jungle)" }}>
          <MessageCircle className="h-4 w-4 mr-2" />{chatOpen ? "Hide AI chat" : "Ask AI about this"}
        </Button>
        {!extended && (
          <Button onClick={loadMore} disabled={loadingMore} variant="outline" className="h-12 rounded-full">
            {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "More details"}
          </Button>
        )}
      </div>

      {extended && (
        <Card className="mt-6 p-5 whitespace-pre-line text-sm leading-relaxed">{extended}</Card>
      )}

      {chatOpen && (
        <div className="mt-4">
          <AiChatPanel subject={{ name: animal.name, kind: animal.category, species: animal.species }} />
        </div>
      )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium text-sm mt-0.5">{value}</div>
    </div>
  );
}
