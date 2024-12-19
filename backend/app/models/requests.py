from datetime import datetime
from pydantic import BaseModel

from .program import Program
from .wip_program import WipProgram


class CreateUserRequest(BaseModel):
    name: str


class UpdateUserRequest(BaseModel):
    id: int
    name: str | None = None


class PublishScriptRequest(BaseModel):
    title: str
    author_id: int
    created_at: datetime
    description: str
    program: Program
    website_id: int


class CreateWebsiteRequest(BaseModel):
    url: str
    description: str


class UpdateUnpublishedScriptRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    website_id: int | None = None
    program: WipProgram | None = None


class CreateAnnotationRequest(BaseModel):
    script_id: int
    location: str
    description: str
