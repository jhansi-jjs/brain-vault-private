import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Brain, Loader2, FileText, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { sendMessage, type ChatMessage } from "@/services/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Chat — LocalMind" }] }),
  component: Dashboard,
});

const initialMessages: ChatMessage[] = [
  { role: "user", content: "Summarize my notes on machine learning" },
  {
    role: "assistant",
    content:
      "Based on your uploaded notes, here are the key concepts from your machine learning documents...",
  },
];

function Dashboard() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await sendMessage(trimmed, messages);
      const reply = res?.response ?? res?.message ?? res?.answer ?? "(no response)";
      setMessages([...next, { role: "assistant", content: String(reply) }]);
    } catch (err) {
      toast.error("Failed to reach LocalMind backend. Is it running at localhost:8000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-border px-6 py-4">
          <h1 className="text-xl font-semibold">Chat with your Knowledge</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Powered by Llama 3 · running locally</p>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "assistant" ? (
                <div className="max-w-[80%] rounded-2xl bg-card border border-border p-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Brain className="h-3.5 w-3.5 text-primary" />
                    LocalMind
                  </div>
                  <p className="text-sm leading-relaxed">{m.content}</p>
                </div>
              ) : (
                <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-3 text-sm">
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                LocalMind is thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="border-t border-border p-4">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary transition-colors">
            <button type="button" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Attach">
              <Paperclip className="h-4 w-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your knowledge..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>
      </main>

      <aside className="hidden lg:flex w-72 shrink-0 flex-col border-l border-border bg-sidebar/50 p-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Sources Used</h2>
        <div className="space-y-3">
          {[
            { icon: FileText, name: "ml-notes.pdf", excerpt: "Supervised learning uses labeled data to train models that map inputs to outputs..." },
            { icon: StickyNote, name: "research.txt", excerpt: "Neural networks consist of layers of interconnected nodes that learn hierarchical features..." },
          ].map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/50 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <s.icon className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate">{s.name}</span>
                </div>
                <span className="rounded-full bg-primary/15 text-primary text-[10px] px-2 py-0.5 font-medium">Relevant</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{s.excerpt}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}