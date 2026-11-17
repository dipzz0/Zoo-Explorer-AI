import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, LogOut, Mail, User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/profile" } }); }, [user, loading, navigate]);
  if (!user) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-6">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Home
      </Link>
      <Card className="p-6 text-center mb-6 border-0 text-primary-foreground" style={{ background: "var(--gradient-jungle)" }}>
        <div className="h-20 w-20 mx-auto rounded-full grid place-items-center text-3xl font-bold bg-card/20 backdrop-blur mb-3">
          {(profile?.name || user.email || "?").charAt(0).toUpperCase()}
        </div>
        <h1 className="text-2xl font-bold">{profile?.name || "Visitor"}</h1>
        <p className="opacity-90 text-sm">{user.email}</p>
      </Card>

      <Card className="divide-y divide-border">
        <Row icon={<User className="h-4 w-4" />} label="Name" value={profile?.name || "—"} />
        <Row icon={<Mail className="h-4 w-4" />} label="Login ID" value={user.email || "—"} />
      </Card>

      <Button variant="outline" onClick={async () => { await signOut(); navigate({ to: "/auth", search: { redirect: "/" } }); }} className="w-full mt-6 h-11 rounded-full text-destructive border-destructive/30 hover:bg-destructive/5">
        <LogOut className="h-4 w-4 mr-2" />Sign out
      </Button>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center">{icon}</div>
      <div className="flex-1">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
