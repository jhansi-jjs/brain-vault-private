import requests

def generate_response(message, context_chunks, history):
	try:
		context = "\n".join([c["text"] for c in context_chunks])
        
		prompt = f"""You are LocalMind, a private AI assistant.
Use the following context to answer the question.

Context:
{context}

Question: {message}

Answer:"""

		response = requests.post(
			"http://localhost:11434/api/generate",
			json={
				"model": "llama3",
				"prompt": prompt,
				"stream": False
			},
			timeout=120
		)
        
		data = response.json()
		print("Ollama response:", data)
		result = data.get("response", "")
		if not result:
			result = str(data)
		return result
            
	except Exception as e:
		return f"Error generating response: {str(e)}"

