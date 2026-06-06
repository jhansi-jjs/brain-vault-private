
from __future__ import annotations

from typing import Dict

from fastapi import APIRouter, File, HTTPException, UploadFile

from services.embeddings import chunk_text, embed_text
from services.vectorstore import add_document

router = APIRouter()


@router.post("/upload")
async def upload(file: UploadFile = File(...)) -> Dict:
	filename = file.filename
	if not filename:
		raise HTTPException(status_code=400, detail="No filename provided")

	content = await file.read()
	text = ""

	# Handle PDF via PyMuPDF (fitz)
	if filename.lower().endswith(".pdf"):
		try:
			import fitz  # PyMuPDF

			doc = fitz.open(stream=content, filetype="pdf")
			pages = []
			for page in doc:
				pages.append(page.get_text())
			text = "\n\n".join(pages)
		except Exception as exc:
			raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {exc}")
	else:
		# Plain text for .txt and .md and others
		try:
			text = content.decode("utf-8")
		except Exception:
			text = content.decode("latin-1", errors="ignore")

	if not text.strip():
		raise HTTPException(status_code=400, detail="Uploaded file contains no extractable text")

	# Chunk and embed
	chunks = chunk_text(text)
	embeddings = [embed_text(c) for c in chunks]

	metadata = {"filename": filename}
	# Use filename as doc_id
	add_document(filename, chunks, embeddings, metadata)

	return {"success": True, "filename": filename, "chunks": len(chunks)}

