import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles } from "lucide-react";
import { chatAboutSubject, type ChatMsg } from "@/lib/recognize";
import { getSpeechRecognition, isVoiceSupported, speak, stopSpeaking } from "@/lib/voice";
import { toast } from "sonner";

interface Props {
  subject: { name: string; kind: string; species?: string };
  suggestions?: string[];
}

export function AiChatPanel({ subject, suggestions = ["Where does it live?", "What does it eat?", "Is it endangered?"] }: Props) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true);
  const recRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const voiceSupported = typeof window !== "undefined" && isVoiceSupported();

  useEffect(() => () => { stopSpeaking(); recRef.current?.stop?.(); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, sending]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || sending) return;
    const userMsg: ChatMsg = { role: "user", content: text.trim() };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setSending(true);
    try {
      const reply = await chatAboutSubject(subject, messages, text.trim());
      setMessages(m => [...m, { role: "assistant", content: reply }]);
      if (voiceMode && voiceSupported) {
        setSpeaking(true);
        speak(reply, () => setSpeaking(false));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Chat failed");
    } finally { setSending(false); }
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
    rec.onerror = (e: any) => { if (e.error !== "aborted") toast.error("Voice error: " + e.error); setListening(false); };
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    rec.start();
  };
  const stopListening = () => { recRef.current?.stop?.(); setListening(false); };
  const toggleSpeak = () => { if (speaking) { stopSpeaking(); setSpeaking(false); } setVoiceMode(v => !v); };

  return (
    <Card className="overflow-hidden flex flex-col" style={{ height: "60vh", maxHeight: 560 }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full grid place-items-center" style={{ background: "var(--gradient-jungle)" }}>
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">Naturalist AI</div>
            <div className="text-[11px] text-muted-foreground leading-tight">
              {speaking ? "Speaking…" : listening ? "Listening…" : `About ${subject.name}`}
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
            Ask me anything about the {subject.name}.
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {suggestions.map(q => (
                <button key={q} onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={m.role === "user"
              ? "max-w-[80%] rounded-2xl rounded-br-md px-4 py-2 text-sm text-primary-foreground"
              : "max-w-[85%] rounded-2xl rounded-bl-md px-4 py-2 text-sm bg-muted"}
              style={m.role === "user" ? { background: "var(--gradient-jungle)" } : undefined}>
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

      <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
        className="border-t border-border/60 p-3 flex items-center gap-2 bg-card">
        {voiceSupported && (
          <Button type="button" size="icon" variant={listening ? "default" : "outline"}
            onClick={listening ? stopListening : startListening}
            className="rounded-full shrink-0"
            style={listening ? { background: "var(--gradient-jungle)" } : undefined}
            aria-label={listening ? "Stop listening" : "Start voice input"}>
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        <Input value={input} onChange={(e) => setInput(e.target.value)}
          placeholder={listening ? "Listening…" : "Type your question…"}
          disabled={sending || listening} className="rounded-full" />
        <Button type="submit" size="icon" disabled={!input.trim() || sending}
          className="rounded-full shrink-0" style={{ background: "var(--gradient-jungle)" }} aria-label="Send">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Card>
  );
}
