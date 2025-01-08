from fastapi import APIRouter
from sqlmodel import select

from ..exceptions.not_found import user_not_found_exception
from ..database import DatabaseDep
from ..models.database_tables import User
from ..models.responses import (
    BaseUserResponse,
    PublicUserWithScriptsResponse,
    UserWithScriptsResponse,
)
from ..models.requests import CreateUserRequest, UpdateUserRequest

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=list[BaseUserResponse])
def get_users(session: DatabaseDep) -> list[BaseUserResponse]:
    users = session.exec(select(User)).all()
    return [user.toBaseUserResponse() for user in users]


@router.post("/", response_model=BaseUserResponse)
def create_user(user: CreateUserRequest, session: DatabaseDep) -> BaseUserResponse:
    new_user = User(name=user.name)
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user.toBaseUserResponse()


@router.get("/{user_id}", response_model=UserWithScriptsResponse)
def get_user(user_id: int, session: DatabaseDep) -> UserWithScriptsResponse:
    user = session.get(User, user_id)
    if not user:
        raise user_not_found_exception(user_id)
    return user.toUserWithScriptsResponse()


@router.patch("/", response_model=BaseUserResponse)
def update_user(user: UpdateUserRequest, session: DatabaseDep) -> BaseUserResponse:
    existing_user = session.get(User, user.id)
    if not existing_user:
        raise user_not_found_exception(user.id)

    if user.name:
        existing_user.name = user.name
    session.commit()
    session.refresh(existing_user)

    return existing_user.toBaseUserResponse()


@router.get("/public/{user_id}", response_model=PublicUserWithScriptsResponse)
def get_public_user(
    user_id: int, session: DatabaseDep
) -> PublicUserWithScriptsResponse:
    user = session.get(User, user_id)
    if not user:
        raise user_not_found_exception(user_id)
    return user.toPublicUserWithScriptsResponse()
