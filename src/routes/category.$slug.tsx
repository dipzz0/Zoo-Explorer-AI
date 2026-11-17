import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { animalsByCategory, categories, type AnimalCategory } from "@/lib/animals";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

const validCategories = ["wild", "birds", "reptiles", "aquatic"] as const;

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: `/category/${slug}` } }); }, [user, loading, navigate, slug]);
  if (!user) return null;

  if (!validCategories.includes(slug as AnimalCategory)) {
    return <div className="p-8 text-center">Unknown category. <Link to="/" className="text-primary underline">Back home</Link></div>;
  }
  const cat = categories.find((c) => c.slug === slug)!;
  const list = animalsByCategory(slug as AnimalCategory);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Back
      </Link>
      <div className="mb-6">
        <div className="text-5xl mb-2">{cat.emoji}</div>
        <h1 className="text-3xl font-bold">{cat.name}</h1>
        <p className="text-muted-foreground">{cat.description}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map((a) => (
          <Link key={a.slug} to="/animal/$slug" params={{ slug: a.slug }}>
            <Card className="group overflow-hidden p-0 border-0 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="aspect-square overflow-hidden">
                <img src={a.image} alt={a.name} loading="eager" decoding="async" width={768} height={768} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-3">
                <div className="font-semibold leading-tight">{a.name}</div>
                <div className="text-xs text-muted-foreground italic truncate">{a.species}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
