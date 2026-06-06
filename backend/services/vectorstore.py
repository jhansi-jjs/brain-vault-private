import chromadb
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data" / "chromadb"
DATA_DIR.mkdir(parents=True, exist_ok=True)

client = chromadb.PersistentClient(path=str(DATA_DIR))

try:
	collection = client.get_collection("localmind")
except:
	collection = client.create_collection("localmind")

def add_document(doc_id, chunks, embeddings, metadata):
	ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
	collection.add(
		ids=ids,
		embeddings=embeddings,
		documents=chunks,
		metadatas=[metadata for _ in chunks]
	)

def query_similar(embedding, n_results=5):
	results = collection.query(
		query_embeddings=[embedding],
		n_results=n_results
	)
	output = []
	for i, doc in enumerate(results["documents"][0]):
		output.append({
			"text": doc,
			"source": results["metadatas"][0][i].get("filename", "unknown"),
			"doc_id": results["ids"][0][i]
		})
	return output

def delete_document(doc_id):
	ids = collection.get(where={"filename": doc_id})["ids"]
	if ids:
		collection.delete(ids=ids)

def get_all_documents():
	results = collection.get()
	seen = {}
	for i, meta in enumerate(results["metadatas"]):
		fname = meta.get("filename", "unknown")
		if fname not in seen:
			seen[fname] = {
				"id": fname,
				"name": fname,
				"type": meta.get("type", "file"),
				"date": meta.get("date", ""),
				"chunks": 1
			}
		else:
			seen[fname]["chunks"] += 1
	return list(seen.values())

