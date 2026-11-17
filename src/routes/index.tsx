import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { categories } from "@/lib/animals";
import { Card } from "@/components/ui/card";
import { Map, Ticket, Sparkles, Download, Smartphone } from "lucide-react";
import zooHero from "@/assets/zoo-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Zoo Explorer AI — Discover Wildlife" },
      { name: "description", content: "Explore wild animals, birds, reptiles, and aquatic life. AI-powered scanning included." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/" } }); }, [user, loading, navigate]);
  if (!user) return null;

  const handleDownloadApp = async () => {
    try {
      const res = await fetch("/Zoo-Explorer-AI.apk");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Zoo-Explorer-AI.apk";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      window.open("/Zoo-Explorer-AI.apk", "_blank");
    }
  };

  return (
    <div>
      {/* Download app banner — top, one tap, no sign-in */}
      <section className="mx-auto max-w-6xl px-4 pt-4">
        <div className="relative overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-earth)" }}>
          <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative p-4 flex items-center gap-3 text-white">
            <div className="shrink-0 h-11 w-11 rounded-xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30 grid place-items-center">
              <Smartphone className="h-5 w-5 drop-shadow" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold leading-tight drop-shadow">Get the Android App</div>
              <div className="text-[12px] text-white/90 leading-snug">One tap to install on your phone.</div>
            </div>
            <button
              type="button"
              onClick={handleDownloadApp}
              className="shrink-0 inline-flex items-center justify-center gap-2 rounded-full bg-white text-foreground px-4 py-2 text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </section>

      {/* Compact hero — text on top so the image stays visible */}
      <section className="mx-auto max-w-6xl px-4 pt-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-medium text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />AI Wildlife Recognition
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold leading-tight">Welcome to the Zoo</h1>
        <p className="text-muted-foreground mt-1 max-w-md text-sm">Tap a category to explore — or scan any creature with AI.</p>
      </section>

      <section className="relative mx-auto max-w-6xl px-4 mt-4">
        <div className="relative rounded-3xl overflow-hidden h-[34vh] min-h-[220px] shadow-[var(--shadow-elevated)]">
          <img src={zooHero} alt="Zoo landscape with wildlife" className="absolute inset-0 h-full w-full object-cover" width={1920} height={1024} fetchPriority="high" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, oklch(0.22 0.04 145 / 0.4) 100%)" }} />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Explore by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c, idx) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }}>
              <Card className="group relative overflow-hidden h-44 border-0 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                <img src={c.image} alt={c.name} loading={idx < 2 ? "eager" : "lazy"} decoding="async" width={800} height={800} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="relative h-full p-4 flex flex-col justify-end text-white">
                  <div className="font-bold leading-tight text-lg drop-shadow">{c.name}</div>
                  <div className="text-xs text-white/85 mt-0.5 line-clamp-2">{c.description}</div>
                </div>
              </Card>
            </Link>
          ))}

          {/* Zoo Map card */}
          <Link to="/map" className="col-span-2 sm:col-span-1">
            <Card className="group relative overflow-hidden h-36 border-0 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer" style={{ background: "var(--gradient-earth)" }}>
              <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 200 144" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <defs>
                  <pattern id="mapGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="white" strokeOpacity="0.12" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="200" height="144" fill="url(#mapGrid)" />
                <path d="M120,90 q15,-18 32,-8 q14,8 4,22 q-12,12 -28,4 q-14,-6 -8,-18 z" fill="white" fillOpacity="0.18" />
                <path d="M-5,110 C40,80 60,120 100,90 S170,70 210,95" fill="none" stroke="white" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
                <path d="M20,30 C55,55 80,25 120,50 S180,40 200,25" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 4" />
                {[[35,55],[50,65],[42,75],[160,30],[172,42],[155,40]].map(([x,y],i)=>(
                  <circle key={i} cx={x} cy={y} r="2.2" fill="white" fillOpacity="0.55" />
                ))}
                <g transform="translate(170,115)" opacity="0.7">
                  <circle r="9" fill="none" stroke="white" strokeWidth="0.8" />
                  <path d="M0,-8 L2.2,0 L0,8 L-2.2,0 Z" fill="white" />
                  <text x="0" y="-11" textAnchor="middle" fontSize="5" fill="white" fontFamily="ui-sans-serif">N</text>
                </g>
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="relative h-full p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 grid place-items-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                    <Map className="h-4 w-4" />
                  </div>
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-white shadow-lg" />
                    <div className="absolute -inset-1 rounded-full border-2 border-white/60 animate-ping" />
                  </div>
                </div>
                <div>
                  <div className="font-bold tracking-tight">Zoo Map</div>
                  <div className="text-[11px] text-white/85">Find your way around</div>
                </div>
              </div>
            </Card>
          </Link>

          {/* Tickets card */}
          <Link to="/tickets" className="col-span-2 sm:col-span-1">
            <Card className="group relative overflow-hidden h-36 border-0 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer" style={{ background: "var(--gradient-sunset)" }}>
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 144" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <g transform="translate(28,28) rotate(-8 72 44)">
                  <path d="M0,12 a12,12 0 0 1 12,-12 h120 a12,12 0 0 1 12,12 v20 a6,6 0 0 0 0,12 v20 a12,12 0 0 1 -12,12 h-120 a12,12 0 0 1 -12,-12 v-20 a6,6 0 0 0 0,-12 z"
                        fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.55" strokeWidth="1" />
                  <line x1="100" y1="6" x2="100" y2="82" stroke="white" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="2 3" />
                  <line x1="14" y1="22" x2="86" y2="22" stroke="white" strokeOpacity="0.55" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="14" y1="34" x2="70" y2="34" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="14" y1="46" x2="60" y2="46" stroke="white" strokeOpacity="0.35" strokeWidth="1.5" strokeLinecap="round" />
                  {[0,3,5,9,12,14,18,21,25,28].map((x,i)=>(
                    <rect key={i} x={110+x} y={56} width={i%3===0?2.5:1.2} height={18} fill="white" fillOpacity="0.7" />
                  ))}
                </g>
                <circle cx="20" cy="20" r="1.5" fill="white" fillOpacity="0.7" />
                <circle cx="180" cy="40" r="1.2" fill="white" fillOpacity="0.6" />
                <circle cx="170" cy="120" r="1.8" fill="white" fillOpacity="0.7" />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />
              <div className="relative h-full p-4 flex flex-col justify-between text-white">
                <div className="h-9 w-9 grid place-items-center rounded-full bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                  <Ticket className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold tracking-tight">Book Tickets</div>
                  <div className="text-[11px] text-white/85">Plan your visit</div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* AI Scanner showcase card */}
        <Card className="mt-6 relative overflow-hidden border-0 shadow-[var(--shadow-elevated)]" style={{ background: "var(--gradient-jungle)" }}>
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
          {/* Subtle grid */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" aria-hidden="true">
            <defs>
              <pattern id="aiGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M 22 0 L 0 0 0 22" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#aiGrid)" />
          </svg>

          <div className="relative p-5 sm:p-6 flex items-center gap-4 text-white">
            {/* Animated scanner icon */}
            <div className="relative shrink-0">
              <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/30 grid place-items-center">
                <Sparkles className="h-7 w-7 drop-shadow" />
              </div>
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white shadow-md" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-white animate-ping" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                AI Powered
              </div>
              <div className="font-bold text-lg leading-tight drop-shadow">Try the AI Scanner</div>
              <div className="text-[13px] text-white/90 leading-snug mt-0.5">
                Snap or upload a photo to instantly identify any wild animal.
              </div>
            </div>
          </div>

          {/* Scanline accent */}
          <div className="relative h-1 w-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[shimmer_2.5s_ease-in-out_infinite]" />
          </div>
        </Card>
      </section>
    </div>
  );
}
