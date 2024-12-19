from sqlmodel import Field, SQLModel, Relationship, desc  # type: ignore
from datetime import datetime
from typing import List

from ..models.wip_program import WipProgram
from .program import Program
from .responses import (
    AnnotationResponse,
    BaseScriptResponse,
    BaseUnpublishedScriptResponse,
    BaseUserResponse,
    BaseWebsiteResponse,
    ScriptWithAuthorAndWebsiteResponse,
    ScriptWithAuthorResponse,
    ScriptWithProgramResponse,
    ScriptWithWebsiteResponse,
    UnpublishedScriptWithProgramResponse,
    UnpublishedScriptWithWebsiteResponse,
    UserWithScriptsResponse,
    WebsiteWithScriptsResponse,
)


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str

    scripts: List["Script"] = Relationship(back_populates="author", cascade_delete=True)
    unpublished_scripts: List["UnpublishedScript"] = Relationship(
        back_populates="author", cascade_delete=True
    )

    def toBaseUserResponse(self) -> BaseUserResponse:
        return BaseUserResponse(id=self.id, name=self.name)

    def toUserWithScriptsResponse(self) -> UserWithScriptsResponse:
        return UserWithScriptsResponse(
            id=self.id,
            name=self.name,
            scripts=[script.toScriptWithWebsiteResponse() for script in self.scripts],
            unpublished_scripts=[
                script.toUnpublishedScriptWithWebsiteResponse()
                for script in self.unpublished_scripts
            ],
        )


class Script(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    author_id: int = Field(default=None, foreign_key="user.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.now())
    description: str
    script_url: str
    website_id: int = Field(foreign_key="website.id", ondelete="RESTRICT")

    author: User = Relationship(back_populates="scripts")
    website: "Website" = Relationship(back_populates="scripts")
    annotations: List["Annotation"] = Relationship(
        back_populates="script", cascade_delete=True
    )

    def toBaseScriptResponse(self) -> BaseScriptResponse:
        return BaseScriptResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
        )

    def toScriptWithWebsiteResponse(self) -> ScriptWithWebsiteResponse:
        return ScriptWithWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            website=self.website.toBaseWesbiteResponse(),
        )

    def toScriptWithAuthorResponse(self) -> ScriptWithAuthorResponse:
        return ScriptWithAuthorResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=self.author.toBaseUserResponse(),
        )

    def toScriptWithAuthorAndWebsiteResponse(
        self,
    ) -> ScriptWithAuthorAndWebsiteResponse:
        return ScriptWithAuthorAndWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=self.author.toBaseUserResponse(),
            website=self.website.toBaseWesbiteResponse(),
        )

    def toScriptWithProgramResponse(
        self, program: Program
    ) -> ScriptWithProgramResponse:
        return ScriptWithProgramResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=self.author.toBaseUserResponse(),
            website=self.website.toBaseWesbiteResponse(),
            program=program,
            annotations=[
                annotation.toAnnotationResponse() for annotation in self.annotations
            ],
        )


class Website(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    url: str
    descrpition: str

    scripts: List[Script] = Relationship(back_populates="website")
    unpublished_scripts: List["UnpublishedScript"] = Relationship(
        back_populates="website"
    )

    def toBaseWesbiteResponse(self) -> BaseWebsiteResponse:
        return BaseWebsiteResponse(
            id=self.id, url=self.url, description=self.descrpition
        )

    def toWebsiteWithScriptsResponse(self) -> WebsiteWithScriptsResponse:
        return WebsiteWithScriptsResponse(
            id=self.id,
            url=self.url,
            description=self.descrpition,
            scripts=[script.toScriptWithAuthorResponse() for script in self.scripts],
        )


class UnpublishedScript(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str | None = Field(default=None, nullable=True)
    author_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.now, nullable=True)
    description: str | None = Field(default=None, nullable=True)
    script_url: str
    website_id: int | None = Field(
        foreign_key="website.id", default=None, nullable=True, ondelete="RESTRICT"
    )

    author: User | None = Relationship(back_populates="unpublished_scripts")
    website: Website | None = Relationship(back_populates="unpublished_scripts")

    def toBaseUnpublishedScriptResponse(self) -> BaseUnpublishedScriptResponse:
        return BaseUnpublishedScriptResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
        )

    def toUnpublishedScriptWithWebsiteResponse(
        self,
    ) -> UnpublishedScriptWithWebsiteResponse:
        return UnpublishedScriptWithWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            website=(
                None if not self.website else self.website.toBaseWesbiteResponse()
            ),
        )

    def toUnpublishedScriptWithProgramResponse(
        self, program: WipProgram
    ) -> UnpublishedScriptWithProgramResponse:
        return UnpublishedScriptWithProgramResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=None if not self.author else self.author.toBaseUserResponse(),
            website=None if not self.website else self.website.toBaseWesbiteResponse(),
            program=program,
        )


class Annotation(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    script_id: int = Field(foreign_key="script.id", ondelete="CASCADE")
    location: str
    description: str

    script: Script = Relationship(back_populates="annotations")

    def toAnnotationResponse(self) -> AnnotationResponse:
        return AnnotationResponse(
            id=self.id, location=self.location, description=self.description
        )
