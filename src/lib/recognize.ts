import { supabase } from "@/integrations/supabase/client";

export interface RecognitionResult {
  name: string;
  kind: "animal" | "bird" | "reptile" | "fish" | "amphibian";
  species?: string;
  habitat?: string;
  diet?: string;
  summary: string;
  facts: string[];
  conservation?: string;
  confidence?: "low" | "medium" | "high";
}

export async function recognizeImage(imageBase64: string, mode: "basic" | "extended" = "basic"): Promise<RecognitionResult> {
  const { data, error } = await supabase.functions.invoke("recognize", {
    body: { imageBase64, mode },
  });
  if (error) {
    const msg = (error as any)?.context?.body?.error || error.message || "Recognition failed";
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data as RecognitionResult;
}

export interface ChatMsg { role: "user" | "assistant"; content: string; }

export async function chatAboutSubject(
  subject: { name: string; kind: string; species?: string },
  history: ChatMsg[],
  question: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke("recognize", {
    body: { action: "chat", subject, history, question },
  });
  if (error) {
    const msg = (error as any)?.context?.body?.error || error.message || "Chat failed";
    throw new Error(msg);
  }
  if (data?.error) throw new Error(data.error);
  return data.reply as string;
}
