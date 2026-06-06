# Brain Vault

> A private, local-first AI knowledge assistant powered by Retrieval-Augmented Generation (RAG), Ollama, ChromaDB, and FastAPI.

Brain Vault (LocalMind) enables users to build a personal knowledge base from documents, notes, and web content, then interact with that knowledge through a conversational AI interface. All inference runs locally using Ollama, ensuring privacy and complete control over your data.

---

## Features

### Knowledge Base Management
- Upload PDF documents
- Import `.txt` and `.md` files
- Add web content via URLs
- Paste and save raw notes directly
- Automatic document chunking and indexing
- Delete individual documents
- Clear the entire knowledge base

### AI-Powered Chat
- Ask questions about uploaded content
- Context-aware Retrieval-Augmented Generation (RAG)
- Source attribution for generated responses
- Multi-document semantic search
- Conversational interface with chat history context

### Local AI Inference
- Runs entirely on your machine using Ollama
- No external AI API required
- Supports multiple models:
  - Llama 3
  - Mistral
  - Phi-3

### Privacy First
- Documents remain local
- Embeddings stored locally
- No cloud dependency for inference
- Ideal for personal notes, research, and private knowledge management

### Modern User Experience
- Dark and light themes
- Responsive dashboard
- Document management interface
- Real-time chat experience

---

## Architecture

```text
┌─────────────────────────┐
│      React Frontend     │
│   TanStack + Vite TS    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│      FastAPI Backend    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   Document Processing   │
│ PDF / TXT / MD / URLs   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│ Sentence Transformers   │
│     Embeddings          │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│       ChromaDB          │
│     Vector Store        │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│        Ollama           │
│ Llama 3 / Mistral / Phi │
└─────────────────────────┘
```

---

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Start
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI
- React Hook Form
- Zod

### Backend

- FastAPI
- Uvicorn
- ChromaDB
- Sentence Transformers
- Ollama
- PyMuPDF
- BeautifulSoup4

---

## Project Structure

```text
brain-vault/
│
├── backend/
│   ├── main.py
│   ├── chat.py
│   ├── llm.py
│   ├── vectorstore.py
│   └── ...
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── routes/
│   ├── services/
│   └── ...
│
├── package.json
├── vite.config.ts
└── README.md
```

---

## How It Works

### 1. Upload Content

Users can upload:

- PDF documents
- Text files
- Markdown files
- Website URLs
- Raw notes

### 2. Create Embeddings

The backend:

- Extracts text
- Splits content into chunks
- Generates embeddings using Sentence Transformers
- Stores vectors in ChromaDB

### 3. Ask Questions

When a user submits a query:

1. The query is embedded.
2. Relevant chunks are retrieved from ChromaDB.
3. Context is sent to Ollama.
4. The selected LLM generates a grounded response.
5. Relevant source documents are displayed.

---

## Installation

### Prerequisites

- Node.js 20+
- Python 3.10+
- Ollama

---

### Clone Repository

```bash
git clone https://github.com/jhansi-jjs/brain-vault-private.git
cd brain-vault-private
```

---

## Backend Setup

Create a virtual environment:

```bash
cd backend

python -m venv venv
```

Activate it:

### Windows

```bash
venv\Scripts\activate
```

### macOS/Linux

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the API:

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

## Ollama Setup

Install Ollama:

```bash
https://ollama.com
```

Pull a model:

```bash
ollama pull llama3
```

Alternative models:

```bash
ollama pull mistral
ollama pull phi3
```

Start Ollama:

```bash
ollama serve
```

Default endpoint:

```text
http://localhost:11434
```

---

## Frontend Setup

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:8081
```

---

## Usage

### Upload Documents

1. Navigate to **Documents**
2. Upload PDFs, TXT, or Markdown files
3. Wait for indexing to complete

### Add Notes

1. Open Documents
2. Paste notes into the editor
3. Save to the knowledge base

### Chat With Your Knowledge

1. Open Chat
2. Ask a question
3. Receive context-aware answers
4. Review cited source documents

### Change Models

1. Open Settings
2. Select:
   - Llama 3
   - Mistral
   - Phi-3
3. Continue chatting with the selected model

---

## Example Queries

```text
Summarize my uploaded notes.
```

```text
What are the key concepts discussed in the PDFs?
```

```text
Compare the topics covered across all documents.
```

```text
Generate study notes from my research files.
```

```text
What information do I have about machine learning?
```

---

## Configuration

### Environment Variables

Create a `.env` file inside the backend directory:

```env
OLLAMA_BASE_URL=http://localhost:11434
CHROMA_DB_PATH=./chroma_db
```

---

## Current Limitations

- No user authentication
- Single-user local deployment
- Chat history is not permanently persisted
- Optimized primarily for local environments
- Requires Ollama to be running

---

## Future Improvements

- User authentication
- Persistent chat history
- Multi-user support
- Document tagging and folders
- Advanced search filters
- Cloud deployment options
- Streaming responses
- Hybrid retrieval pipelines

---

## Screenshots

### Chat Interface

- Conversational AI powered by local LLMs
- Source-backed responses
- Context-aware retrieval

### Document Management

- Upload PDFs, TXT, and Markdown files
- Manage indexed documents
- Add notes and URLs

### Settings

- Model selection
- Theme preferences
- Knowledge base management

---

## License

This project is licensed under the MIT License.

---

## Author

**Jhansi J**

Built as a privacy-focused local AI knowledge assistant powered by FastAPI, ChromaDB, Ollama, and modern React tooling.
