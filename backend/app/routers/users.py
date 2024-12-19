from fastapi import APIRouter

from ..models.responses import BaseUserResponse, UserWithScriptsResponse
from ..models.requests import UpdateUserRequest

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=BaseUserResponse)
def create_user() -> BaseUserResponse:
    return BaseUserResponse(id=0, name="User1")


@router.get("/{user_id}", response_model=UserWithScriptsResponse)
def get_user(user_id: int) -> UserWithScriptsResponse:
    return UserWithScriptsResponse(
        id=0, name="User1", scripts=[], unpublished_scripts=[]
    )


@router.patch("/", response_model=BaseUserResponse)
def update_user(user: UpdateUserRequest) -> BaseUserResponse:
    return BaseUserResponse(id=0, name="User1")
