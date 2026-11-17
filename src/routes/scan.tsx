import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Sparkles, Heart, ChevronLeft, Send, Mic, MicOff, Volume2, VolumeX, MessageCircle } from "lucide-react";
import { recognizeImage, chatAboutSubject, type RecognitionResult, type ChatMsg } from "@/lib/recognize";
import { getSpeechRecognition, isVoiceSupported, speak, stopSpeaking } from "@/lib/voice";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/scan")({
  component: ScanPage,
});

function ScanPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [extended, setExtended] = useState<RecognitionResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceSupported = typeof window !== "undefined" && isVoiceSupported();

  useEffect(() => { if (!loading && !user) navigate({ to: "/auth", search: { redirect: "/scan" } }); }, [user, loading, navigate]);

  useEffect(() => {
    const img = sessionStorage.getItem("zoo:pendingImage");
    if (!img) return;
    sessionStorage.removeItem("zoo:pendingImage");
    setImage(img);
    setAnalyzing(true);
    setResult(null);
    setExtended(null);
    setMessages([]);
    recognizeImage(img, "basic")
      .then(async (r) => {
        setResult(r);
        if (user) {
          // Compress to a small thumbnail before saving — keeps history fast.
          const thumb = await compressToThumb(img, 320, 0.6).catch(() => null);
          // Fire and forget — don't block UI on the DB write.
          supabase.from("scan_history").insert({
            user_id: user.id, name: r.name, kind: r.kind, summary: r.summary, image_data: thumb,
          }).then(({ error }) => { if (error) console.warn("history save failed", error); });
        }
      })
      .catch((e) => toast.error(e.message || "Recognition failed"))
      .finally(() => setAnalyzing(false));
  }, [user]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  // Cleanup voice on unmount
  useEffect(() => () => { stopSpeaking(); recRef.current?.stop?.(); }, []);

  const loadMore = async () => {
    if (!image) return;
    setLoadingMore(true);
    try {
      const r = await recognizeImage(image, "extended");
      setExtended(r);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    } finally { setLoadingMore(false); }
  };

  const saveFav = async () => {
    if (!result || !user) return;
    const { error } = await supabase.from("favorites").upsert({
      user_id: user.id, animal_name: result.name, category: result.kind, image_url: null,
    }, { onConflict: "user_id,animal_name" });
    if (error) toast.error(error.message); else toast.success("Saved to favorites ❤️");
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !result || sending) return;
    const userMsg: ChatMsg = { role: "user", content: text.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const reply = await chatAboutSubject(
        { name: result.name, kind: result.kind, species: result.species },
        messages,
        text.trim(),
      );
      setMessages(m => [...m, { role: "assistant", content: reply }]);
      if (voiceMode && voiceSupported) {
        setSpeaking(true);
        speak(reply, () => setSpeaking(false));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally {
      setSending(false);
    }
  };

  const startListening = () => {
    if (!voiceSupported) { toast.error("Voice not supported in this browser"); return; }
    stopSpeaking();
    setSpeaking(false);
    const rec = getSpeechRecognition();
    if (!rec) return;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: any) => {
      const text = e.results?.[0]?.[0]?.transcript ?? "";
      if (text) sendMessage(text);
    };
    rec.onerror = (e: any) => {
      if (e.error !== "aborted") toast.error("Voice error: " + e.error);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };

  const stopListening = () => { recRef.current?.stop?.(); setListening(false); };
  const toggleSpeak = () => { if (speaking) { stopSpeaking(); setSpeaking(false); } setVoiceMode(v => !v); };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-32">
      <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ChevronLeft className="h-4 w-4" />Home
      </Link>

      {!image && (
        <Card className="p-10 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-1">AI Wildlife Scanner</h2>
          <p className="text-muted-foreground text-sm">Use the camera, scan, or upload buttons below to identify any animal, bird, reptile, or fish.</p>
        </Card>
      )}

      {image && (
        <>
          <div className="rounded-3xl overflow-hidden shadow-[var(--shadow-elevated)] mb-4 bg-muted">
            <img src={image} alt="Scanned subject" className="w-full max-h-[55vh] object-contain bg-black" />
          </div>

          {analyzing && (
            <Card className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                  <div className="font-semibold">Identifying…</div>
                  <div className="text-xs text-muted-foreground">Our AI is examining the image.</div>
                </div>
              </div>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
          )}

          {result && (
            <Card className="p-6">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary font-semibold">{result.kind}</div>
                  <h2 className="text-2xl font-bold">{result.name}</h2>
                  {result.species && <div className="italic text-muted-foreground text-sm">{result.species}</div>}
                </div>
                <Button onClick={saveFav} variant="outline" size="icon" className="rounded-full" aria-label="Save to favorites"><Heart className="h-5 w-5" /></Button>
              </div>
              <p className="text-sm leading-relaxed mb-4">{result.summary}</p>

              {(result.habitat || result.diet) && (
                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  {result.habitat && <Mini label="Habitat" value={result.habitat} />}
                  {result.diet && <Mini label="Diet / Conditions" value={result.diet} />}
                </div>
              )}

              {result.facts?.length > 0 && (
                <ul className="space-y-1.5 text-sm">
                  {result.facts.map((f, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{f}</li>)}
                </ul>
              )}

              <div className="flex gap-2 mt-5">
                <Button
                  onClick={() => setChatOpen(o => !o)}
                  className="flex-1 h-11 rounded-full"
                  style={{ background: "var(--gradient-jungle)" }}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {chatOpen ? "Hide chat" : "Ask AI about this"}
                </Button>
                {!extended && (
                  <Button onClick={loadMore} disabled={loadingMore} variant="outline" className="h-11 rounded-full">
                    {loadingMore ? <Loader2 className="h-4 w-4 animate-spin" /> : "More insights"}
                  </Button>
                )}
              </div>

              {extended && (
                <div className="mt-5 pt-5 border-t border-border space-y-3">
                  <div className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Deeper insights</div>
                  <p className="text-sm leading-relaxed">{extended.summary}</p>
                  {extended.conservation && (
                    <div className="text-sm"><span className="font-semibold">Conservation: </span>{extended.conservation}</div>
                  )}
                  {extended.facts?.length > 0 && (
                    <ul className="space-y-1.5 text-sm">
                      {extended.facts.map((f, i) => <li key={i} className="flex gap-2"><span className="text-primary">•</span>{f}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </Card>
          )}

          {result && chatOpen && (
            <Card className="mt-4 overflow-hidden flex flex-col" style={{ height: "60vh", maxHeight: 560 }}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full grid place-items-center" style={{ background: "var(--gradient-jungle)" }}>
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold leading-tight">Naturalist AI</div>
                    <div className="text-[11px] text-muted-foreground leading-tight">
                      {speaking ? "Speaking…" : listening ? "Listening…" : `About ${result.name}`}
                    </div>
                  </div>
                </div>
                {voiceSupported && (
                  <Button variant="ghost" size="icon" onClick={toggleSpeak} aria-label={voiceMode ? "Mute voice" : "Unmute voice"}>
                    {voiceMode ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                )}
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    Ask me anything about the {result.name}.
                    <div className="mt-3 flex flex-wrap gap-2 justify-center">
                      {["Where does it live?", "What does it eat?", "Is it endangered?"].map(q => (
                        <button
                          key={q}
                          onClick={() => sendMessage(q)}
                          className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted transition-colors"
                        >{q}</button>
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        m.role === "user"
                          ? "max-w-[80%] rounded-2xl rounded-br-md px-4 py-2 text-sm text-primary-foreground"
                          : "max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2 text-sm bg-muted"
                      }
                      style={m.role === "user" ? { background: "var(--gradient-jungle)" } : undefined}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
                className="border-t border-border/60 p-3 flex items-center gap-2 bg-card"
              >
                {voiceSupported && (
                  <Button
                    type="button"
                    size="icon"
                    variant={listening ? "default" : "outline"}
                    onClick={listening ? stopListening : startListening}
                    className="rounded-full shrink-0"
                    style={listening ? { background: "var(--gradient-jungle)" } : undefined}
                    aria-label={listening ? "Stop listening" : "Start voice input"}
                  >
                    {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? "Listening…" : "Type your question…"}
                  disabled={sending || listening}
                  className="rounded-full"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || sending}
                  className="rounded-full shrink-0"
                  style={{ background: "var(--gradient-jungle)" }}
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 p-3">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium text-sm mt-0.5">{value}</div>
    </div>
  );
}

async function compressToThumb(dataUrl: string, maxSize = 320, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      const w = Math.round(img.width * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}
