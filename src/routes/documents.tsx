import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { UploadCloud, Link2, FileText, Trash2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { addUrl, deleteDocument, getDocuments, uploadFile } from "@/services/api";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents — LocalMind" }] }),
  component: DocumentsPage,
});

type Doc = {
  id: string;
  name?: string;
  filename?: string;
  created_at?: string;
  date?: string;
  chunks?: number;
  chunk_count?: number;
};

function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    try {
      const res = await getDocuments();
      setDocs(Array.isArray(res) ? res : res?.documents ?? []);
    } catch {
      toast.error("Couldn't load documents from localhost:8000");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (const f of Array.from(files)) {
        await uploadFile(f);
      }
      toast.success("Uploaded successfully");
      refresh();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddUrl(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setUploading(true);
    try {
      await addUrl(url.trim());
      toast.success("URL added");
      setUrl("");
      refresh();
    } catch {
      toast.error("Failed to add URL");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveNotes() {
    if (!notes.trim()) return;
    setUploading(true);
    try {
      const blob = new Blob([notes], { type: "text/plain" });
      const file = new File([blob], `notes-${Date.now()}.txt`, { type: "text/plain" });
      await uploadFile(file);
      toast.success("Notes saved");
      setNotes("");
      refresh();
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteDocument(id);
      toast.success("Deleted");
      setDocs((d) => d.filter((x) => x.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          <header>
            <h1 className="text-3xl font-bold">Your Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">Upload documents, add URLs, or paste raw notes.</p>
          </header>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInput.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragOver ? "border-primary bg-primary/5" : "border-primary/40 bg-card/30 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <input
              ref={fileInput}
              type="file"
              multiple
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <UploadCloud className="mx-auto h-12 w-12 text-primary" />
            <p className="mt-4 font-medium">Drop PDFs, .txt or .md files here</p>
            <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            {uploading && (
              <div className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Uploading...
              </div>
            )}
          </div>

          <form onSubmit={handleAddUrl} className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary transition-colors">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a URL to add a webpage..."
                className="flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)] disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add URL
            </button>
          </form>

          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Or paste raw notes here..."
              rows={5}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary transition-colors resize-none"
            />
            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                disabled={uploading || !notes.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[var(--shadow-glow)] disabled:opacity-50"
              >
                Save Notes
              </button>
            </div>
          </div>

          <section>
            <h2 className="text-lg font-semibold mb-3">Documents</h2>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading...
              </div>
            ) : docs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No documents yet. Upload one above to get started.</p>
            ) : (
              <div className="space-y-2">
                {docs.map((d) => (
                  <div
                    key={d.id}
                    className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{d.name ?? d.filename ?? d.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {(d.created_at ?? d.date ?? "Recently added")} · {(d.chunks ?? d.chunk_count ?? 0)} chunks
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-2"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}