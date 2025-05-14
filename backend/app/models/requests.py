from datetime import datetime
from pydantic import BaseModel

from .CSTprogram import CSTProgram
from .ASTprogram import ASTProgram


class CreateUserRequest(BaseModel):
    name: str


class UpdateUserRequest(BaseModel):
    id: int
    name: str | None = None


class UpdateWorkflowRequest(BaseModel):
    title: str
    description: str
    program: ASTProgram
    website_id: int


class PublishWorkflowRequest(UpdateWorkflowRequest):
    author_id: int
    created_at: datetime


class CreateWebsiteRequest(BaseModel):
    url: str
    description: str


class UpdateUnpublishedWorkflowRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    website_id: int | None = None
    program: CSTProgram | None = None
    published_script_id: int | None = None


class CreateAnnotationRequest(BaseModel):
    location: str
    description: str
