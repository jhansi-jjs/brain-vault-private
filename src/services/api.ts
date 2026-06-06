const API_BASE = "http://127.0.0.1:8000";

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
  // If response is not ok, throw with status and body (if available)
  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(`Upload failed: ${res.status} ${body}`);
  }

  // Try to parse JSON, but some backends return empty 200 OK — treat as success
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return { ok: true };
    }
  }

  return { ok: true };
}

export async function addUrl(url: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Invalid URL");
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only http/https URLs are allowed");
  }
  const res = await fetch(`${API_BASE}/api/add-url`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: parsed.toString() }),
  });
  return handle(res);
}

export async function getDocuments() {
  const res = await fetch(`${API_BASE}/api/documents`);
  return handle(res);
}

export async function deleteDocument(id: string) {
  const res = await fetch(`${API_BASE}/api/documents/${encodeURIComponent(id)}`, { method: "DELETE" });
  return handle(res);
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/api/health`);
  return handle(res);
}