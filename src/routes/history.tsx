import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, History as HistoryIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Row { id: string; name: string; kind: string | null; summary: string | null; image_data: string | null; created_at: string; }

export const Route = createFileRoute("/history")({
  component: HistoryPage,
});

function HistoryPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/history" } }); }, [user, loading, navigate]);
  useEffect(() => { if (user) load(); }, [user]);

  const load = async () => {
    const { data } = await supabase
      .from("scan_history")
      .select("id,name,kind,summary,image_data,created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    setRows((data as Row[]) || []);
  };

  const remove = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase.from("scan_history").delete().eq("id", id);
    setBusyId(null);
    if (error) { toast.error(error.message); return; }
    setRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Removed from history");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Home
      </Link>
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6"><HistoryIcon className="h-7 w-7 text-primary" />Scan History</h1>
      {rows.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">Nothing scanned yet — try the AI scanner from the home page!</Card>
      ) : (
        <div className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className="p-4 flex gap-4 items-start">
              {r.image_data ? (
                <img src={r.image_data} alt={r.name} loading="lazy" decoding="async" className="h-20 w-20 rounded-xl object-cover bg-muted" />
              ) : (
                <div className="h-20 w-20 rounded-xl grid place-items-center text-2xl shrink-0" style={{ background: "var(--gradient-jungle)" }}>🌿</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{r.name}</div>
                  {r.kind && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">{r.kind}</span>}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{r.summary}</p>
                <div className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                onClick={() => remove(r.id)}
                disabled={busyId === r.id}
                aria-label="Delete scan"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
