from __future__ import annotations
from datetime import datetime
from pydantic import BaseModel

from .CSTprogram import CSTProgram
from .ASTprogram import ASTProgram


class StatusResponse(BaseModel):
    status: str


class SuccessResponse(BaseModel):
    ok: bool = True


class BaseUserResponse(BaseModel):
    id: int
    name: str


class PublicUserWithWorkflowsResponse(BaseUserResponse):
    scripts: list[WorkflowWithWebsiteResponse]


class UserWithWorkflowsResponse(PublicUserWithWorkflowsResponse):
    unpublished_scripts: list[UnpublishedWorkflowWithWebsiteResponse]


class BaseWorkflowResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    description: str


class WorkflowWithAuthorResponse(BaseWorkflowResponse):
    author: BaseUserResponse


class WorkflowWithWebsiteResponse(BaseWorkflowResponse):
    website: BaseWebsiteResponse


class WorkflowWithAuthorAndWebsiteResponse(BaseWorkflowResponse):
    author: BaseUserResponse
    website: BaseWebsiteResponse


class FullWorkflowResponse(WorkflowWithAuthorAndWebsiteResponse):
    program: ASTProgram


class BaseWebsiteResponse(BaseModel):
    id: int
    url: str
    description: str


class WebsiteWithWorkflowsResponse(BaseWebsiteResponse):
    scripts: list[WorkflowWithAuthorResponse]


class BaseUnpublishedWorkflowResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    description: str | None = None


class UnpublishedWorkflowWithWebsiteResponse(BaseUnpublishedWorkflowResponse):
    website: BaseWebsiteResponse | None = None


class FullUnpublishedWorkflowResponse(UnpublishedWorkflowWithWebsiteResponse):
    published_script_id: int | None
    author: BaseUserResponse | None
    program: CSTProgram | None = None
    annotations: list[AnnotationResponse] | None = None


class AnnotationResponse(BaseModel):
    id: int
    location: str
    description: str
