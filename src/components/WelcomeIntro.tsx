import splashBg from "@/assets/splash-bg.jpg";
import logo from "@/assets/app-logo.png";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function WelcomeIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] overflow-hidden">
      <img src={splashBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, oklch(0.18 0.05 145 / 0.55) 0%, oklch(0.15 0.04 145 / 0.9) 100%)" }}
      />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center text-white">
        <div className="h-28 w-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 grid place-items-center shadow-2xl mb-6">
          <img src={logo} alt="Zoo Explorer AI" width={88} height={88} className="h-22 w-22" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">Zoo Explorer AI</h1>
        <p className="text-base text-white/90 max-w-sm leading-relaxed mb-2">
          Discover wildlife with the power of AI.
        </p>
        <p className="text-sm text-white/75 max-w-xs leading-relaxed">
          Scan, capture, and learn about every creature on your zoo adventure.
        </p>
        <Button
          onClick={onStart}
          className="mt-10 h-12 px-8 rounded-full bg-white text-foreground hover:bg-white/90 font-semibold shadow-xl"
        >
          Let's Start
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <p className="mt-6 text-xs text-white/60">A wild journey awaits 🌿</p>
      </div>
    </div>
  );
}
