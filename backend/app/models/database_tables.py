from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship  # type: ignore

from .CSTprogram import CSTProgram
from .ASTprogram import ASTProgram
from .responses import (
    AnnotationResponse,
    BaseWorkflowResponse,
    BaseUnpublishedWorkflowResponse,
    BaseUserResponse,
    BaseWebsiteResponse,
    PublicUserWithWorkflowsResponse,
    WorkflowWithAuthorAndWebsiteResponse,
    WorkflowWithAuthorResponse,
    FullWorkflowResponse,
    WorkflowWithWebsiteResponse,
    FullUnpublishedWorkflowResponse,
    UnpublishedWorkflowWithWebsiteResponse,
    UserWithWorkflowsResponse,
    WebsiteWithWorkflowsResponse,
)


class User(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    name: str

    scripts: list["Script"] = Relationship(back_populates="author", cascade_delete=True)
    unpublished_scripts: list["UnpublishedScript"] = Relationship(
        back_populates="author", cascade_delete=True
    )

    def toBaseUserResponse(self) -> BaseUserResponse:
        return BaseUserResponse(id=self.id, name=self.name)

    def toPublicUserWithScriptsResponse(self) -> PublicUserWithWorkflowsResponse:
        return PublicUserWithWorkflowsResponse(
            id=self.id,
            name=self.name,
            scripts=[script.toScriptWithWebsiteResponse() for script in self.scripts],
        )

    def toUserWithScriptsResponse(self) -> UserWithWorkflowsResponse:
        return UserWithWorkflowsResponse(
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
    annotations: list["Annotation"] = Relationship(
        back_populates="script", cascade_delete=True
    )

    def toBaseScriptResponse(self) -> BaseWorkflowResponse:
        return BaseWorkflowResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
        )

    def toScriptWithWebsiteResponse(self) -> WorkflowWithWebsiteResponse:
        return WorkflowWithWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            website=self.website.toBaseWesbiteResponse(),
        )

    def toScriptWithAuthorResponse(self) -> WorkflowWithAuthorResponse:
        return WorkflowWithAuthorResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=self.author.toBaseUserResponse(),
        )

    def toScriptWithAuthorAndWebsiteResponse(
        self,
    ) -> WorkflowWithAuthorAndWebsiteResponse:
        return WorkflowWithAuthorAndWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=self.author.toBaseUserResponse(),
            website=self.website.toBaseWesbiteResponse(),
        )

    def toScriptWithProgramResponse(self, program: ASTProgram) -> FullWorkflowResponse:
        return FullWorkflowResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=self.author.toBaseUserResponse(),
            website=self.website.toBaseWesbiteResponse(),
            program=program,
        )


class Website(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    url: str
    descrpition: str

    scripts: list[Script] = Relationship(back_populates="website")
    unpublished_scripts: list["UnpublishedScript"] = Relationship(
        back_populates="website"
    )

    def toBaseWesbiteResponse(self) -> BaseWebsiteResponse:
        return BaseWebsiteResponse(
            id=self.id, url=self.url, description=self.descrpition
        )

    def toWebsiteWithScriptsResponse(self) -> WebsiteWithWorkflowsResponse:
        return WebsiteWithWorkflowsResponse(
            id=self.id,
            url=self.url,
            description=self.descrpition,
            workflows=[script.toScriptWithAuthorResponse() for script in self.scripts],
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


class UnpublishedScript(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    title: str
    author_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.now, nullable=True)
    description: str | None = Field(default=None, nullable=True)
    script_url: str
    website_id: int | None = Field(
        foreign_key="website.id", default=None, nullable=True, ondelete="RESTRICT"
    )
    published_script_id: int | None = Field(
        foreign_key="script.id", default=None, nullable=True, ondelete="RESTRICT"
    )

    author: User | None = Relationship(back_populates="unpublished_scripts")
    website: Website | None = Relationship(back_populates="unpublished_scripts")

    def toBaseUnpublishedScriptResponse(self) -> BaseUnpublishedWorkflowResponse:
        return BaseUnpublishedWorkflowResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
        )

    def toUnpublishedScriptWithWebsiteResponse(
        self,
    ) -> UnpublishedWorkflowWithWebsiteResponse:
        return UnpublishedWorkflowWithWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            website=(
                None if not self.website else self.website.toBaseWesbiteResponse()
            ),
        )

    def toUnpublishedScriptWithProgramResponse(
        self, program: CSTProgram | None, annotations: list[Annotation]
    ) -> FullUnpublishedWorkflowResponse:
        return FullUnpublishedWorkflowResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            author=None if not self.author else self.author.toBaseUserResponse(),
            website=None if not self.website else self.website.toBaseWesbiteResponse(),
            published_script_id=self.published_script_id,
            program=program,
            annotations=[a.toAnnotationResponse() for a in annotations],
        )
