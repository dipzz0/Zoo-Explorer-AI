import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Toaster } from "@/components/ui/sonner";
import { ScanFooter } from "@/components/ScanFooter";
import { ProfileMenu } from "@/components/ProfileMenu";
import { SplashScreen } from "@/components/SplashScreen";
import { WelcomeIntro } from "@/components/WelcomeIntro";
import logo from "@/assets/app-logo.png";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This trail leads nowhere. Let's head back to the zoo entrance.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            Back to Zoo
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1" },
      { title: "Zoo Explorer AI — Discover Wildlife with AI" },
      { name: "description", content: "Explore the zoo with AI-powered animal recognition. Scan, capture, or upload — and learn about every creature." },
      { name: "theme-color", content: "#3a7d44" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Zoo Explorer" },
      { property: "og:title", content: "Zoo Explorer AI — Discover Wildlife with AI" },
      { name: "twitter:title", content: "Zoo Explorer AI — Discover Wildlife with AI" },
      { property: "og:description", content: "Explore the zoo with AI-powered animal recognition. Scan, capture, or upload — and learn about every creature." },
      { name: "twitter:description", content: "Explore the zoo with AI-powered animal recognition. Scan, capture, or upload — and learn about every creature." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5ceee708-ad08-4da6-8544-6aee8f230070" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/5ceee708-ad08-4da6-8544-6aee8f230070" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", type: "image/png", href: "/icon-192.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <AppShell />
      <Toaster />
    </AuthProvider>
  );
}

function AppShell() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const [replaySplash, setReplaySplash] = useState(false);
  const [introDismissed, setIntroDismissed] = useState(true);
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIntroDismissed(localStorage.getItem("zoo_intro_seen") === "1");
    }
  }, []);
  useEffect(() => {
    if (mounted && !loading) {
      const t = setTimeout(() => setSplashDone(true), 400);
      return () => clearTimeout(t);
    }
  }, [mounted, loading]);

  useEffect(() => {
    if (replaySplash) {
      const t = setTimeout(() => setReplaySplash(false), 700);
      return () => clearTimeout(t);
    }
  }, [replaySplash]);

  const isAuthRoute = location.pathname === "/auth";

  if (!mounted || loading || !splashDone) return <SplashScreen />;
  if (replaySplash) return <SplashScreen />;

  if (!user && !introDismissed) {
    return (
      <WelcomeIntro
        onStart={() => {
          localStorage.setItem("zoo_intro_seen", "1");
          setIntroDismissed(true);
          if (!isAuthRoute) window.location.href = "/auth";
        }}
      />
    );
  }

  if (isAuthRoute) return <Outlet />;

  return (
    <div className="min-h-screen bg-background">
      {user && <Header onLogoClick={() => setReplaySplash(true)} />}
      <main className={user ? "pb-28" : ""}>
        <Outlet />
      </main>
      {user && <ScanFooter />}
    </div>
  );
}

function Header({ onLogoClick }: { onLogoClick: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <button onClick={onLogoClick} className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" aria-label="Show app intro">
          <div className="h-10 w-10 rounded-2xl overflow-hidden grid place-items-center shadow-md" style={{ background: "var(--gradient-jungle)" }}>
            <img src={logo} alt="Zoo Explorer AI logo" width={40} height={40} className="h-9 w-9 object-contain" />
          </div>
          <div className="leading-tight text-left">
            <div className="font-bold text-foreground">Zoo Explorer AI</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Wildlife • Discover • Learn</div>
          </div>
        </button>
        <ProfileMenu />
      </div>
    </header>
  );
}
