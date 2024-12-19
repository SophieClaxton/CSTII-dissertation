from datetime import datetime
from fastapi import APIRouter
from typing import List

from ..models.program import Program
from ..models.responses import (
    BaseScriptResponse,
    BaseUserResponse,
    BaseWebsiteResponse,
    ScriptWithAuthorAndWebsiteResponse,
    ScriptWithAuthorResponse,
    ScriptWithProgramResponse,
    ScriptWithWebsiteResponse,
    SuccessResponse,
)
from ..models.requests import PublishScriptRequest, CreateAnnotationRequest

router = APIRouter(prefix="/scripts", tags=["scripts"])


@router.get("/", response_model=List[ScriptWithAuthorAndWebsiteResponse])
def get_scripts(
    name_query: str | None = None,
) -> List[ScriptWithAuthorAndWebsiteResponse]:
    return []


@router.post("/", response_model=BaseScriptResponse)
def create_script(script: PublishScriptRequest) -> BaseScriptResponse:
    return BaseScriptResponse(
        id=0,
        title="first script",
        created_at=datetime.now(),
        description="a simple script",
    )


@router.get("/{script_id}", response_model=ScriptWithProgramResponse)
def get_script(script_id: int) -> ScriptWithProgramResponse:
    return ScriptWithProgramResponse(
        id=0,
        title="first script",
        created_at=datetime.now(),
        description="a simple script",
        author=BaseUserResponse(id=0, name="user1"),
        website=BaseWebsiteResponse(
            id=0, url="gov.uk", description="The Gov's Website"
        ),
        program=Program(),
        annotations=[],
    )


@router.delete("/{script_id}", response_model=SuccessResponse)
def delete_script(script_id: int) -> SuccessResponse:
    return SuccessResponse()


@router.post("/{script_id}/annotate", response_model=SuccessResponse)
def create_annotation(
    script_id: int, annotation: CreateAnnotationRequest
) -> SuccessResponse:
    return SuccessResponse()


@router.get("/{user_id}", response_model=List[ScriptWithWebsiteResponse])
def get_user_scripts(user_id: int) -> List[ScriptWithWebsiteResponse]:
    return []


@router.get("/{website_id}", response_model=List[ScriptWithAuthorResponse])
def get_website_scripts(website_id: int) -> List[ScriptWithAuthorResponse]:
    return []
