import splashBg from "@/assets/splash-bg.jpg";
import logo from "@/assets/app-logo.png";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <img src={splashBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, oklch(0.18 0.05 145 / 0.55) 0%, oklch(0.15 0.04 145 / 0.85) 100%)" }} />
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-8 text-center text-white">
        <div className="h-28 w-28 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 grid place-items-center shadow-2xl mb-6 animate-[pulse_2s_ease-in-out_infinite]">
          <img src={logo} alt="Zoo Explorer AI" width={88} height={88} className="h-22 w-22" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Zoo Explorer AI</h1>
        <p className="text-base text-white/85 max-w-xs leading-relaxed">
          Discover wildlife with the power of AI — scan, learn, and explore nature like never before.
        </p>
        <div className="mt-10 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="h-2 w-2 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
