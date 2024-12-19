from datetime import datetime
from fastapi import APIRouter
from typing import List

from ..models.responses import (
    BaseUnpublishedScriptResponse,
    BaseUserResponse,
    SuccessResponse,
    UnpublishedScriptWithWebsiteResponse,
    UnpublishedScriptWithProgramResponse,
)
from ..models.requests import UpdateUnpublishedScriptRequest

router = APIRouter(prefix="/unpublished_scripts", tags=["unpublished_scripts"])


@router.get("/{user_id}", response_model=List[UnpublishedScriptWithWebsiteResponse])
def get_user_unpublished_scripts(
    user_id: int, name_query: str | None = None
) -> List[UnpublishedScriptWithWebsiteResponse]:
    return []


@router.post("/{user_id}", response_model=BaseUnpublishedScriptResponse)
def create_user_unpublished_script(user_id: int) -> BaseUnpublishedScriptResponse:
    return BaseUnpublishedScriptResponse(id=0, created_at=datetime.now())


@router.get("/{script_id}", response_model=UnpublishedScriptWithProgramResponse)
def get_unpublished_script(script_id: int) -> UnpublishedScriptWithProgramResponse:
    return UnpublishedScriptWithProgramResponse(
        id=0, created_at=datetime.now(), author=BaseUserResponse(id=0, name="User1")
    )


@router.patch("/{script_id}", response_model=UnpublishedScriptWithProgramResponse)
def update_unpublished_script(
    script_id: int, script: UpdateUnpublishedScriptRequest
) -> UnpublishedScriptWithProgramResponse:
    return UnpublishedScriptWithProgramResponse(
        id=0, created_at=datetime.now(), author=BaseUserResponse(id=0, name="User1")
    )


@router.delete("/{script_id}", response_model=SuccessResponse)
def delete_unpublished_script(script_id: int) -> SuccessResponse:
    return SuccessResponse()


@router.get(
    "/{user_id}/{website_id}", response_model=List[BaseUnpublishedScriptResponse]
)
def get_user_website_unpublished_scripts(
    user_id: int, website_id: int
) -> List[BaseUnpublishedScriptResponse]:
    return []
