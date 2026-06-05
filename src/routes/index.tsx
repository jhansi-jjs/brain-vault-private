import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Brain, ArrowRight, Lock, Bot, Zap, Github } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LocalMind — Your Private AI Second Brain" },
      { name: "description", content: "Chat with your notes, PDFs and links using local AI. Your data never leaves your device." },
      { property: "og:title", content: "LocalMind — Your Private AI Second Brain" },
      { property: "og:description", content: "Chat with your notes, PDFs and links using local AI. Your data never leaves your device." },
    ],
  }),
  component: Index,
});

function Index() {
  const features = [
    { icon: Lock, emoji: "🔒", title: "Private by Default", desc: "Everything runs on your machine. Zero cloud. Zero tracking." },
    { icon: Bot, emoji: "🤖", title: "Powered by Open AI", desc: "Uses Llama 3 locally via Ollama. No API keys needed." },
    { icon: Zap, emoji: "⚡", title: "Instant Answers", desc: "Chat with all your knowledge in one place instantly." },
  ];
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/50">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Brain className="h-6 w-6 text-primary" />
          <span>LocalMind</span>
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5"
        >
          Get Started
        </Link>
      </nav>

      <section className="px-6 md:px-12 pt-24 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 text-xs text-muted-foreground mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          100% local · open source
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
          Your Second Brain.{" "}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            Fully Private.
          </span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Chat with your notes, PDFs and links using local AI. Your data never leaves your device.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)] hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/50 px-6 py-3 text-sm font-medium text-foreground transition-all hover:bg-card hover:border-primary/50 hover:-translate-y-0.5"
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </a>
        </div>
      </section>

      <section className="px-6 md:px-12 pb-24 max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-xl">
                {f.emoji}
              </div>
              <h3 className="font-semibold text-lg">{f.title}</h3>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-border/50 px-6 py-8 text-center text-sm text-muted-foreground">
        Built for Mozilla.ai Hackathon • Open Source • MIT License
      </footer>
    </div>
  );
}
