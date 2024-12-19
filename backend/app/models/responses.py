from __future__ import annotations
from typing import List
from pydantic import BaseModel
from datetime import datetime

from .program import Program
from .wip_program import WipProgram


class StatusResponse(BaseModel):
    status: str


class SuccessResponse(BaseModel):
    ok: bool = True


class BaseUserResponse(BaseModel):
    id: int
    name: str


class UserWithScriptsResponse(BaseUserResponse):
    scripts: List[ScriptWithWebsiteResponse]
    unpublished_scripts: List[UnpublishedScriptWithWebsiteResponse]


class BaseScriptResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    description: str


class ScriptWithAuthorResponse(BaseScriptResponse):
    author: BaseUserResponse


class ScriptWithWebsiteResponse(BaseScriptResponse):
    website: BaseWebsiteResponse


class ScriptWithAuthorAndWebsiteResponse(BaseScriptResponse):
    author: BaseUserResponse
    website: BaseWebsiteResponse


class ScriptWithProgramResponse(ScriptWithAuthorAndWebsiteResponse):
    program: Program
    annotations: List[AnnotationResponse]


class BaseWebsiteResponse(BaseModel):
    id: int
    url: str
    description: str


class WebsiteWithScriptsResponse(BaseWebsiteResponse):
    scripts: List[ScriptWithAuthorResponse]


class BaseUnpublishedScriptResponse(BaseModel):
    id: int
    title: str | None = None
    created_at: datetime
    description: str | None = None


class UnpublishedScriptWithWebsiteResponse(BaseUnpublishedScriptResponse):
    website: BaseWebsiteResponse | None = None


class UnpublishedScriptWithProgramResponse(UnpublishedScriptWithWebsiteResponse):
    author: BaseUserResponse | None
    program: WipProgram | None = None


class AnnotationResponse(BaseModel):
    id: int
    location: str
    description: str
