import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { ChevronLeft, MapPin } from "lucide-react";
import mapBg from "@/assets/zoo-map-bg.jpg";

const zones = [
  { id: "wild", name: "Wild Zone", sub: "Lions • Tigers • Bears", x: 18, y: 32, accent: "oklch(0.55 0.15 40)" },
  { id: "birds", name: "Aviary", sub: "Parrots • Eagles", x: 72, y: 22, accent: "oklch(0.55 0.14 160)" },
  { id: "reptiles", name: "Reptile House", sub: "Snakes • Lizards", x: 78, y: 55, accent: "oklch(0.5 0.13 130)" },
  { id: "aquatic", name: "Aquarium", sub: "Fish • Marine Life", x: 28, y: 68, accent: "oklch(0.55 0.14 230)" },
  { id: "garden", name: "Botanical Garden", sub: "Trees • Flowers", x: 60, y: 78, accent: "oklch(0.55 0.14 340)" },
];

const categoryFor: Record<string, string> = { wild: "wild", birds: "birds", reptiles: "reptiles", aquatic: "aquatic" };

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/map" } }); }, [user, loading, navigate]);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Home
      </Link>
      <h1 className="text-3xl font-bold mb-1">Zoo Map</h1>
      <p className="text-muted-foreground mb-6">Tap any pin to explore that zone.</p>

      <Card className="relative w-full aspect-[4/3] overflow-hidden border border-border/60 shadow-[var(--shadow-elevated)]">
        <img src={mapBg} alt="Aerial view of the zoo" width={1280} height={960} className="absolute inset-0 h-full w-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/30" />

        {zones.map((z) => {
          const target = categoryFor[z.id];
          const pin = (
            <div className="group absolute -translate-x-1/2 -translate-y-full cursor-pointer" style={{ left: `${z.x}%`, top: `${z.y}%` }}>
              <div className="relative flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-md bg-card/95 backdrop-blur text-foreground text-[11px] font-semibold shadow-lg border border-border/60 whitespace-nowrap mb-1 group-hover:scale-105 transition-transform">
                  {z.name}
                  <div className="text-[9px] font-normal text-muted-foreground">{z.sub}</div>
                </div>
                <div className="h-7 w-7 rounded-full grid place-items-center shadow-lg ring-2 ring-white" style={{ background: z.accent }}>
                  <MapPin className="h-4 w-4 text-white" fill="currentColor" />
                </div>
                <div className="h-2 w-2 -mt-0.5 rounded-full" style={{ background: z.accent, boxShadow: "0 0 0 4px color-mix(in oklab, currentColor 20%, transparent)" }} />
              </div>
            </div>
          );
          return target ? (
            <Link key={z.id} to="/category/$slug" params={{ slug: target }}>{pin}</Link>
          ) : (
            <div key={z.id}>{pin}</div>
          );
        })}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold border border-border/60 shadow-md flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />Main Entrance
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {zones.map(z => (
          <div key={z.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5">
            <div className="h-8 w-8 rounded-full grid place-items-center shrink-0" style={{ background: z.accent }}>
              <MapPin className="h-4 w-4 text-white" fill="currentColor" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">{z.name}</div>
              <div className="text-xs text-muted-foreground truncate">{z.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
