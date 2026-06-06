from __future__ import annotations

import importlib.util
import logging
from pathlib import Path
from typing import List
import sys

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
	import chromadb
except Exception:  # pragma: no cover - optional dependency
	chromadb = None

logger = logging.getLogger("localmind.backend")

# Ensure `backend` directory is on sys.path so route modules can import `services` as a top-level package
_BACKEND_DIR = Path(__file__).parent.resolve()
if str(_BACKEND_DIR) not in sys.path:
	sys.path.insert(0, str(_BACKEND_DIR))


def import_router_module(module_path: Path, module_name: str):
	"""Dynamically import a module from a file path and return it."""
	spec = importlib.util.spec_from_file_location(module_name, str(module_path))
	if spec is None or spec.loader is None:
		raise ImportError(f"Cannot import module {module_name} from {module_path}")
	module = importlib.util.module_from_spec(spec)
	spec.loader.exec_module(module)
	return module


def create_app() -> FastAPI:
	app = FastAPI(title="LocalMind API")

	origins: List[str] = [
		"http://localhost:8082",
		"http://localhost:8081",
		"http://localhost:8080",
		"http://127.0.0.1:8082",
		"http://127.0.0.1:8000",
		"http://localhost:5173",
		"http://localhost:3000",
		"https://brain-vault-private.lovable.app",
	]

	app.add_middleware(
		CORSMiddleware,
		# Use wildcard origins for now so any local dev port can connect.
		# TODO: restrict this to `origins` before production.
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	# Include routers from backend/routes/*.py if they expose a `router` variable
	base = Path(__file__).parent / "routes"
	route_modules = ["upload", "chat", "documents", "health"]
	for name in route_modules:
		path = base / f"{name}.py"
		try:
			module = import_router_module(path, f"backend.routes.{name}")
			router = getattr(module, "router", None)
			if router is not None:
				app.include_router(router, prefix="/api")
				logger.debug("Included router from %s", path)
			else:
				logger.debug("Module %s has no attribute 'router', skipping include", path)
		except FileNotFoundError:
			logger.debug("Route file not found: %s", path)
		except Exception:
			logger.exception("Error importing route module %s", path)

	@app.get("/")
	async def root():
		return {"message": "LocalMind API is running", "status": "ok"}

	@app.on_event("startup")
	async def startup_event():
		# Initialize ChromaDB collection on startup if chromadb is installed
		if chromadb is None:
			logger.info("chromadb not available; skipping ChromaDB initialization")
			return
		try:
			client = chromadb.Client()
			# try to get existing collection, otherwise create it
			try:
				collection = client.get_collection("localmind")
			except Exception:
				collection = client.create_collection("localmind")
			app.state.chroma_client = client
			app.state.chroma_collection = collection
			logger.info("ChromaDB collection 'localmind' initialized")
		except Exception:
			logger.exception("Failed to initialize ChromaDB client/collection")

	return app


app = create_app()


if __name__ == "__main__":
	import uvicorn

	uvicorn.run(app, host="0.0.0.0", port=8000)

