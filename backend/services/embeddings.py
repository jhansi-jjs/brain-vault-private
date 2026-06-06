from __future__ import annotations

from pathlib import Path
from typing import List

from sentence_transformers import SentenceTransformer


# Load the sentence-transformers model once at import time
_MODEL_NAME = "all-MiniLM-L6-v2"
_model = SentenceTransformer(_MODEL_NAME)


def embed_text(text: str) -> List[float]:
	"""Return an embedding vector for the provided `text` as a plain Python list.

	Args:
		text: Input text to embed.

	Returns:
		List[float]: Embedding vector.
	"""
	emb = _model.encode(text)
	# Convert numpy array to list if necessary
	try:
		return emb.tolist()  # type: ignore
	except Exception:
		return list(map(float, emb))


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
	"""Chunk text into overlapping pieces.

	This is a character-based chunker with a simple sliding window.

	Args:
		text: Original text.
		chunk_size: Maximum characters per chunk.
		overlap: Number of characters to overlap between consecutive chunks.

	Returns:
		List[str]: List of text chunks.
	"""
	if chunk_size <= 0:
		raise ValueError("chunk_size must be > 0")
	if overlap < 0:
		raise ValueError("overlap must be >= 0")

	text = text.strip()
	if not text:
		return []

	step = max(1, chunk_size - overlap)
	chunks: List[str] = []
	start = 0
	length = len(text)
	while start < length:
		end = start + chunk_size
		chunk = text[start:end]
		chunks.append(chunk.strip())
		if end >= length:
			break
		start += step

	return chunks

