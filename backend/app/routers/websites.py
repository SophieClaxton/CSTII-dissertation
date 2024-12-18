from fastapi import APIRouter

router = APIRouter(prefix="/websites", tags=["websites"])


@router.get("/")
def get_websites(name_query: str = None):
    return {"websites": []}


@router.post("/")
def create_website():
    return {"website": {}}
