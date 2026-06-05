import { Link, useRouterState } from "@tanstack/react-router";
import { Brain, MessageSquare, FolderOpen, Settings } from "lucide-react";

const items = [
  { to: "/dashboard", label: "Chat", icon: MessageSquare, emoji: "💬" },
  { to: "/documents", label: "Documents", icon: FolderOpen, emoji: "📁" },
  { to: "/settings", label: "Settings", icon: Settings, emoji: "⚙️" },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar p-4">
      <Link to="/" className="flex items-center gap-2 px-2 py-3 font-semibold">
        <Brain className="h-5 w-5 text-primary" />
        <span>LocalMind</span>
      </Link>
      <nav className="mt-6 flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex items-center gap-2 rounded-lg border border-border bg-card/50 px-3 py-2 text-xs text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        Llama 3 Running
      </div>
    </aside>
  );
}