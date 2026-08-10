import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Send, User, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Typewriter } from "@/components/motion-primitives";
import { api } from "@/services/api";

export const Route = createFileRoute("/chat")({
  head: () => ({ meta: [{ title: "AI Career Assistant — SkillPilot AI" }] }),
  component: ChatPage,
});

type Msg = { role: "user" | "ai"; text: string; sources?: any[] };
const suggestions = ["How can I improve my resume?", "What should I learn next?", "What are Docker volumes?"];

function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, thinking]);

  async function send(text: string) {
    if (!text.trim() || thinking) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput(""); setThinking(true);
    try {
      const result = await api.chat(text);
      const answer = result?.reply || result?.answer || result?.response || result?.message || "I couldn't generate an answer.";
      setMessages((m) => [...m, { role: "ai", text: answer, sources: result?.sources || [] }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Assistant request failed");
      setMessages((m) => [...m, { role: "ai", text: "I couldn't reach the career assistant. Please check that the backend and Ollama service are running." }]);
    } finally { setThinking(false); }
  }

  return (
    <AppShell title="AI Career Assistant" description="Ask questions backed by your career data and the SkillPilot knowledge base.">
      <div className="glass-panel flex h-[70vh] flex-col p-5">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "ai" && <span className="glass grid size-8 shrink-0 place-items-center rounded-full"><Bot className="size-3.5 text-accent" /></span>}
                <div className={m.role === "user" ? "bg-brand max-w-[78%] rounded-2xl rounded-br-md px-4 py-2.5 text-sm text-primary-foreground" : "surface-card max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 text-sm"}>
                  {m.role === "ai" && i === messages.length - 1 ? <Typewriter text={m.text} speed={18} /> : m.text}
                  {m.sources && m.sources.length > 0 && <div className="mt-3 border-t border-border/60 pt-2"><p className="mb-1 text-[11px] font-medium text-muted-foreground">Sources</p>{m.sources.map((s: any, j: number) => <div key={j} className="flex items-center gap-1 text-[11px] text-muted-foreground"><ExternalLink className="size-3" />{s.title || s.name || s.source || s.filename || "Knowledge source"}</div>)}</div>}
                </div>
                {m.role === "user" && <span className="glass grid size-8 shrink-0 place-items-center rounded-full"><User className="size-3.5" /></span>}
              </motion.div>
            ))}
          </AnimatePresence>
          {!messages.length && <div className="grid h-full place-items-center text-center"><div><Bot className="mx-auto size-8 text-accent" /><p className="mt-3 text-sm text-muted-foreground">Ask me about your resume, skills, roadmap, interviews, or career topics.</p></div></div>}
          {thinking && <div className="flex items-center gap-2"><span className="glass grid size-8 place-items-center rounded-full"><Bot className="size-3.5 text-accent" /></span><div className="surface-card flex gap-1.5 rounded-2xl px-4 py-3">{[0,1,2].map((d) => <motion.span key={d} className="size-1.5 rounded-full bg-muted-foreground" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.1, repeat: Infinity, delay: d * .15 }} />)}</div></div>}
          <div ref={endRef} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">{suggestions.map((s) => <button key={s} type="button" onClick={() => send(s)} className="glass rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/50 hover:text-foreground">{s}</button>)}</div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your career…" aria-label="Message" className="h-12 rounded-full" />
          <Button type="submit" variant="hero" size="icon" className="size-12" aria-label="Send" disabled={thinking}><Send /></Button>
        </form>
      </div>
    </AppShell>
  );
}
