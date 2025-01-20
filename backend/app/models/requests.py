from datetime import datetime
from pydantic import BaseModel

from .ASTprogram import ASTProgram
from .CSTprogram import CSTProgram


class CreateUserRequest(BaseModel):
    name: str


class UpdateUserRequest(BaseModel):
    id: int
    name: str | None = None


class UpdateScriptRequest(BaseModel):
    title: str
    description: str
    program: ASTProgram
    website_id: int


class PublishScriptRequest(UpdateScriptRequest):
    author_id: int
    created_at: datetime


class CreateWebsiteRequest(BaseModel):
    url: str
    description: str


class UpdateUnpublishedScriptRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    website_id: int | None = None
    program: CSTProgram | None = None
    published_script_id: int | None = None


class CreateAnnotationRequest(BaseModel):
    location: str
    description: str
