import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Ticket, CheckCircle2, Loader2, Users, GraduationCap, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { TICKET_PRICES, type TierId } from "@/lib/ticketPricing";
import { bookTicket } from "@/server/tickets.functions";

interface TicketRow { id: string; visit_date: string; visitors: number; total_amount: number; status: string; created_at: string; }

const TIERS: { id: TierId; label: string; note: string; icon: typeof UserIcon }[] = [
  { id: "adult",   label: "Adult",          note: "Ages 13–59",                icon: UserIcon },
  { id: "student", label: "Student",        note: "Valid student ID required", icon: GraduationCap },
  { id: "child",   label: "Child",          note: "Ages 3–12",                 icon: UserIcon },
  { id: "senior",  label: "Senior Citizen", note: "Ages 60+",                  icon: UserIcon },
  { id: "family",  label: "Family Pack",    note: "2 adults + 2 children",     icon: Users },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export const Route = createFileRoute("/tickets")({
  component: TicketsPage,
});

function TicketsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [tier, setTier] = useState<TierId>("adult");
  const [qty, setQty] = useState(2);
  const [busy, setBusy] = useState(false);
  const [tickets, setTickets] = useState<TicketRow[]>([]);

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/tickets" } }); }, [user, loading, navigate]);
  useEffect(() => { if (user) refresh(); }, [user]);

  const refresh = async () => {
    const { data } = await supabase.from("tickets").select("*").order("created_at", { ascending: false });
    setTickets((data as TicketRow[]) || []);
  };

  const selected = TIERS.find(t => t.id === tier)!;
  const tierPrice = TICKET_PRICES[tier].price;
  const isFamily = tier === "family";
  const visitors = isFamily ? qty * 4 : qty;
  const total = tierPrice * qty;

  const book = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      const result = await bookTicket({ data: { tier, qty, visit_date: date } });
      toast.success(`Booking confirmed! ${inr(result.total)} charged (simulated).`);
      refresh();
    } catch (err: any) {
      toast.error(err?.message || "Booking failed");
    } finally {
      setBusy(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Home
      </Link>

      <Card className="p-6 mb-6 text-primary-foreground border-0" style={{ background: "var(--gradient-sunset)" }}>
        <Ticket className="h-8 w-8 mb-2" />
        <h1 className="text-2xl font-bold">Book Your Visit</h1>
        <p className="text-sm opacity-90">Choose a ticket type • Skip the queue</p>
      </Card>

      {/* Price chart */}
      <h2 className="text-lg font-bold mb-3">Ticket prices</h2>
      <Card className="mb-6 overflow-hidden">
        <div className="divide-y divide-border/60">
          {TIERS.map((t) => {
            const Icon = t.icon;
            const active = tier === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTier(t.id); setQty(1); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${active ? "bg-primary/10" : "hover:bg-muted/40"}`}
              >
                <div className={`h-9 w-9 rounded-full grid place-items-center shrink-0 ${active ? "text-primary-foreground" : "text-primary bg-primary/10"}`} style={active ? { background: "var(--gradient-jungle)" } : undefined}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.note}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{inr(TICKET_PRICES[t.id].price)}</div>
                  <div className="text-[10px] text-muted-foreground">{t.id === "family" ? "per pack" : "per person"}</div>
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 mb-8">
        <form onSubmit={book} className="grid sm:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <Label htmlFor="date">Visit date</Label>
            <Input id="date" type="date" value={date} min={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qty">{isFamily ? "Family packs" : "Visitors"}</Label>
            <Input id="qty" type="number" min={1} max={20} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))} required />
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total ({visitors} visitor{visitors > 1 ? "s" : ""})</div>
            <div className="text-2xl font-bold">{inr(total)}</div>
          </div>
          <Button type="submit" disabled={busy} className="sm:col-span-3 h-11 rounded-full" style={{ background: "var(--gradient-jungle)" }}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : `Confirm & pay ${inr(total)} (simulated)`}
          </Button>
        </form>
      </Card>

      <h2 className="text-xl font-bold mb-3">Your tickets</h2>
      {tickets.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">No tickets yet — book your first visit above.</Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id} className="p-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full grid place-items-center text-primary-foreground" style={{ background: "var(--gradient-jungle)" }}>
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{new Date(t.visit_date).toLocaleDateString(undefined, { weekday: "short", month: "long", day: "numeric" })}</div>
                <div className="text-xs text-muted-foreground">{t.visitors} visitor{t.visitors > 1 ? "s" : ""} • Confirmed</div>
              </div>
              <div className="text-lg font-bold">{inr(Number(t.total_amount))}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
