
from __future__ import annotations

from typing import Dict

import requests
from fastapi import APIRouter

from services.vectorstore import get_all_documents

router = APIRouter()


@router.get("/health")
async def health() -> Dict:
	# Check Ollama reachability
	ollama_ok = False
	try:
		resp = requests.get("http://localhost:11434", timeout=2)
		ollama_ok = resp.status_code < 500
	except Exception:
		ollama_ok = False

	# Documents count from ChromaDB
	try:
		docs = get_all_documents()
		count = len(docs)
	except Exception:
		count = 0

	status = "ok" if ollama_ok else "degraded"
	return {"status": status, "model": "llama3", "documents_count": count}

