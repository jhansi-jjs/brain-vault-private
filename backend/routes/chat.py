
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from services.embeddings import embed_text
from services.vectorstore import query_similar
from services.llm import generate_response

router = APIRouter()


class ChatRequest(BaseModel):
	message: str
	conversation_history: Optional[List[dict]] = []


@router.post("/chat")
async def chat(request: ChatRequest):
	try:
		embedding = embed_text(request.message)
		chunks = query_similar(embedding, n_results=5)
		response = generate_response(
			request.message, 
			chunks, 
			request.conversation_history
		)
		sources = [
			{"filename": c["source"], "excerpt": c["text"][:100]} 
			for c in chunks
		]
		return {"response": response, "sources": sources}
	except Exception as e:
		print(f"Chat error: {e}")
		return {
			"response": f"Error: {str(e)}", 
			"sources": []
		}

