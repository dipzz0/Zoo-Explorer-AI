import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, MailCheck } from "lucide-react";
import { toast } from "sonner";
import zooHero from "@/assets/zoo-hero.jpg";
import appLogo from "@/assets/app-logo.png";

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>) => {
    const r = s.redirect;
    const safe = typeof r === "string" && r.startsWith("/") && !r.startsWith("//") ? r : "/";
    return { redirect: safe };
  },
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [verifySent, setVerifySent] = useState<string | null>(null);

  useEffect(() => {
    if (user) navigate({ to: search.redirect || "/" });
  }, [user, navigate, search.redirect]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) { toast.error("Please enter your name"); return; }
        const { error } = await signUp(name.trim(), email.trim(), password);
        if (error) throw error;
        setVerifySent(email.trim());
        toast.success("Verification email sent — check your inbox 📬");
      } else {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          // Friendlier message for unverified accounts
          if (/confirm|verify|not.*confirmed/i.test(error.message)) {
            throw new Error("Please verify your email first. Check your inbox for the link.");
          }
          throw error;
        }
        toast.success("Welcome back!");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 relative">
      {/* Mobile nature bg */}
      <img src={zooHero} alt="" aria-hidden className="lg:hidden absolute inset-0 h-full w-full object-cover" />
      <div className="lg:hidden absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.22 0.05 145 / 0.55), oklch(0.15 0.04 145 / 0.85))" }} />

      <div className="relative hidden lg:block">
        <img src={zooHero} alt="Zoo animals together in a lush jungle" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, oklch(0.22 0.04 145 / 0.4), oklch(0.45 0.13 150 / 0.5))" }} />
        <div className="relative z-10 h-full flex flex-col justify-end p-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl overflow-hidden grid place-items-center bg-white/10 backdrop-blur-md border border-white/20">
              <img src={appLogo} alt="Zoo Explorer AI logo" width={44} height={44} className="h-11 w-11 object-contain" />
            </div>
            <span className="text-2xl font-bold">Zoo Explorer AI</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight max-w-md">Every animal has a story. Discover them all.</h1>
          <p className="mt-3 text-primary-foreground/80 max-w-md">Scan, capture, or upload — let AI guide your visit through the wild.</p>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center p-6 sm:p-12">
        <Card className="w-full max-w-md p-8 shadow-[var(--shadow-elevated)]">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-2xl overflow-hidden grid place-items-center shadow-md" style={{ background: "var(--gradient-jungle)" }}>
              <img src={appLogo} alt="Zoo Explorer AI logo" width={40} height={40} className="h-9 w-9 object-contain" />
            </div>
            <span className="font-bold text-lg">Zoo Explorer AI</span>
          </div>

          {verifySent ? (
            <div className="text-center py-4">
              <div className="mx-auto h-14 w-14 rounded-full grid place-items-center mb-4" style={{ background: "var(--gradient-jungle)" }}>
                <MailCheck className="h-7 w-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your email</h2>
              <p className="text-sm text-muted-foreground mb-1">We've sent a verification link to</p>
              <p className="font-semibold mb-5 break-all">{verifySent}</p>
              <p className="text-xs text-muted-foreground mb-6">Click the link in the email to activate your account, then come back and sign in.</p>
              <Button
                onClick={() => { setVerifySent(null); setMode("signin"); setPassword(""); }}
                className="w-full h-11 rounded-full"
                style={{ background: "var(--gradient-jungle)" }}
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h2>
              <p className="text-sm text-muted-foreground mb-6">{mode === "signin" ? "Sign in to continue exploring." : "Join us and start discovering wildlife with AI."}</p>

              <form onSubmit={submit} className="space-y-4">
                {mode === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" required />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email / Login ID</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      minLength={6}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground rounded-md"
                      aria-label={showPw ? "Hide password" : "Show password"}
                      tabIndex={-1}
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={busy} className="w-full h-11 rounded-full" style={{ background: "var(--gradient-jungle)" }}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <p className="mt-6 text-sm text-center text-muted-foreground">
                {mode === "signin" ? "New here? " : "Already have an account? "}
                <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-semibold hover:underline">
                  {mode === "signin" ? "Create account" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
