const API_BASE = "http://localhost:8000";

export type ChatMessage = { role: "user" | "assistant"; content: string };

async function handle(res: Response) {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export async function sendMessage(message: string, history: ChatMessage[]) {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, conversation_history: history }),
  });
  return handle(res);
}

export async function uploadFile(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload`, { method: "POST", body: form });
  return handle(res);
}

export async function addUrl(url: string) {
  const res = await fetch(`${API_BASE}/api/add-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return handle(res);
}

export async function getDocuments() {
  const res = await fetch(`${API_BASE}/api/documents`);
  return handle(res);
}

export async function deleteDocument(id: string) {
  const res = await fetch(`${API_BASE}/api/documents/${id}`, { method: "DELETE" });
  return handle(res);
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return handle(res);
}