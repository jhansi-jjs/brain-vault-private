import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Moon, Sun, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — LocalMind" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [model, setModel] = useState("llama3");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  function handleClear() {
    if (!confirm("Delete all uploaded documents? This cannot be undone.")) return;
    toast.success("Knowledge base cleared");
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
          <h1 className="text-3xl font-bold">Settings</h1>

          <Section title="AI Model" description="Models run locally via Ollama">
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full max-w-sm rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="llama3">Llama 3</option>
              <option value="mistral">Mistral</option>
              <option value="phi3">Phi-3</option>
            </select>
          </Section>

          <Section title="Appearance">
            <div className="inline-flex rounded-xl border border-border bg-card p-1">
              <button
                onClick={() => setTheme("dark")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${
                  theme === "dark" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-all ${
                  theme === "light" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>
            </div>
          </Section>

          <Section title="Knowledge Base">
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">This will delete all your uploaded documents</p>
                  <p className="text-xs text-muted-foreground mt-1">There is no way to recover them once deleted.</p>
                </div>
                <button
                  onClick={handleClear}
                  className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-all hover:bg-destructive/90 hover:-translate-y-0.5"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          </Section>

          <Section title="About">
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>Version: <span className="text-foreground">v1.0.0</span></p>
              <p>Built for Mozilla.ai Hackathon</p>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-all hover:border-primary/50 hover:-translate-y-0.5"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </Section>
        </div>
      </main>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card/40 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-xs text-muted-foreground mt-1 mb-4">{description}</p>}
      <div className={description ? "" : "mt-4"}>{children}</div>
    </section>
  );
}