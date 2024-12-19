from sqlmodel import Field, SQLModel, Relationship, desc  # type: ignore
from datetime import datetime
from typing import List

from .responses import (
    BaseUserResponse,
    BaseWebsiteResponse,
    ScriptWithWebsiteResponse,
    UnpublishedScriptWithWebsiteResponse,
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


class Script(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str
    author_id: int = Field(default=None, foreign_key="user.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.now)
    description: str
    script_url: str
    website_id: int = Field(foreign_key="website.id", ondelete="RESTRICT")

    author: User = Relationship(back_populates="scripts")
    website: "Website" = Relationship(back_populates="scripts")
    annotations: List["Annotation"] = Relationship(
        back_populates="script", cascade_delete=True
    )

    def toScriptWithWebsiteResponse(self) -> ScriptWithWebsiteResponse:
        return ScriptWithWebsiteResponse(
            id=self.id,
            title=self.title,
            created_at=self.created_at,
            description=self.description,
            website=self.website.toBaseWesbiteResponse(),
        )


class Website(SQLModel, table=True):
    id: int = Field(primary_key=True)
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


class UnpublishedScript(SQLModel, table=True):
    id: int = Field(primary_key=True)
    title: str | None = Field(nullable=True)
    author_id: int = Field(foreign_key="user.id", ondelete="CASCADE")
    created_at: datetime = Field(default=datetime.now, nullable=True)
    description: str | None = Field(nullable=True)
    script_url: str
    website_id: int | None = Field(
        foreign_key="website.id", nullable=True, ondelete="RESTRICT"
    )

    author: User | None = Relationship(back_populates="unpublished_scripts")
    website: Website | None = Relationship(back_populates="unpublished_scripts")

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


class Annotation(SQLModel, table=True):
    id: int = Field(primary_key=True)
    script_id: int = Field(foreign_key="script.id", ondelete="CASCADE")
    location: str
    description: str

    script: Script = Relationship(back_populates="annotations")
