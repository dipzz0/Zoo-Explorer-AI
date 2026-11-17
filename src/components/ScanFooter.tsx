import { useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { Camera, ScanLine, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export function ScanFooter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const captureRef = useRef<HTMLInputElement>(null);
  const scanRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!user) { navigate({ to: "/auth", search: { redirect: "/scan" } }); return; }
    const base64 = await fileToBase64(file);
    sessionStorage.setItem("zoo:pendingImage", base64);
    navigate({ to: "/scan" });
  };

  const openScan = () => {
    if (!user) { navigate({ to: "/auth", search: { redirect: "/scan" } }); return; }
    scanRef.current?.click();
  };

  type Item = { icon: typeof Camera; label: string; primary?: boolean; onClick: () => void };
  const items: Item[] = [
    { icon: Camera, label: "Capture", onClick: () => captureRef.current?.click() },
    { icon: ScanLine, label: "Scan", primary: true, onClick: openScan },
    { icon: Upload, label: "Upload", onClick: () => uploadRef.current?.click() },
  ];

  return (
    <>
      <input
        ref={captureRef}
        type="file"
        accept="image/*"
        {...{ capture: "environment" }}
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <input
        ref={scanRef}
        type="file"
        accept="image/*"
        {...{ capture: "environment" }}
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <input
        ref={uploadRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />
      <nav className="fixed bottom-0 inset-x-0 z-50 px-4 pb-4 pt-2 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="rounded-3xl bg-card border border-border/60 shadow-[var(--shadow-elevated)] px-3 py-2 flex items-center justify-around">
            {items.map(({ icon: Icon, label, onClick, primary }) => (
              <button
                key={label}
                onClick={onClick}
                className={primary
                  ? "flex flex-col items-center gap-1 -mt-6 px-5 py-3 rounded-2xl text-primary-foreground shadow-lg hover:scale-105 transition-transform"
                  : "flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground hover:text-primary transition-colors"}
                style={primary ? { background: "var(--gradient-jungle)" } : undefined}
                aria-label={label}
              >
                <Icon className={primary ? "h-7 w-7" : "h-5 w-5"} />
                <span className={primary ? "text-xs font-semibold" : "text-[11px] font-medium"}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
