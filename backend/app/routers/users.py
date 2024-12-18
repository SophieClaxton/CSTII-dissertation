from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/")
def create_user():
    return {"user": {}}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"user": {}}


@router.put("/{user_id}")
def update_user(user_id: int):
    return {"user": {}}
