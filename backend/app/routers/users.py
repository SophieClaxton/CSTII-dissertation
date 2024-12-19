from fastapi import APIRouter, HTTPException, status

from ..database import DbDep
from ..models.database_tables import User
from ..models.responses import BaseUserResponse, UserWithScriptsResponse
from ..models.requests import CreateUserRequest, UpdateUserRequest

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=BaseUserResponse)
def create_user(user: CreateUserRequest, session: DbDep) -> BaseUserResponse:
    new_user = User(name=user.name)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return BaseUserResponse(id=new_user.id, name=new_user.name)


@router.get("/{user_id}", response_model=UserWithScriptsResponse)
def get_user(user_id: int, session: DbDep) -> UserWithScriptsResponse:
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Did not find user with id {user_id}",
        )
    return UserWithScriptsResponse(
        id=user.id,
        name=user.name,
        scripts=[script.toScriptWithWebsiteResponse() for script in user.scripts],
        unpublished_scripts=[
            script.toUnpublishedScriptWithWebsiteResponse()
            for script in user.unpublished_scripts
        ],
    )


@router.patch("/", response_model=BaseUserResponse)
def update_user(user: UpdateUserRequest, session: DbDep) -> BaseUserResponse:
    existing_user = session.get(User, user.id)
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Did not find user with id {user.id}",
        )

    if user.name:
        existing_user.name = user.name
    session.commit()
    session.refresh(existing_user)

    return BaseUserResponse(id=existing_user.id, name=existing_user.name)
