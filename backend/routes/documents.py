
from fastapi import APIRouter
from services.vectorstore import get_all_documents

router = APIRouter()


@router.get("/documents")
async def list_documents():
    try:
        docs = get_all_documents()
        return {"documents": docs}
    except Exception as e:
        print(f"Error getting documents: {e}")
        return {"documents": []}


@router.delete("/documents/{doc_id}")
async def remove_document(doc_id: str):
    try:
        # import delete_document here to ensure module-level import uses only get_all_documents
        from services.vectorstore import delete_document

        delete_document(doc_id)
        return {"success": True}
    except Exception as e:
        print(f"Error deleting document: {e}")
        return {"success": False}

