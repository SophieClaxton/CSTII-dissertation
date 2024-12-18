from __future__ import annotations
from sqlmodel import Field, SQLModel, Relationship
from datetime import datetime
from typing import List


class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str

    # scripts: List[Script] = Relationship(back_populates="author")
    # unpublished_scripts: List[UnpublishedScript] = Relationship(back_populates="author")


class Script(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
    author_id: int = Field(foreign_key="user.id")
    created_at: datetime = Field(default=datetime.now)
    description: str
    script_url: str
    website_id: int = Field(foreign_key="website.id")

    # author: User = Relationship(back_populates="scripts")
    # website: Website = Relationship(back_populates="scripts")
    # annotations: List[Annotation] = Relationship(back_populates="script")


class UnpublishedScript(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str | None = Field(nullable=True)
    author_id: int | None = Field(foreign_key="user.id", nullable=True)
    created_at: datetime | None = Field(default=datetime.now, nullable=True)
    description: str | None = Field(nullable=True)
    script_url: str
    website_id: int | None = Field(foreign_key="website.id", nullable=True)

    # author: User | None = Relationship(back_populates="unpublished_scripts")
    # website: Website | None = Relationship(back_populates="unpublished_scripts")


class Website(SQLModel, table=True):
    id: int = Field(primary_key=True)
    url: str
    descrpition: str

    # scripts: List[Script] = Relationship(back_populates="website")
    # unpublished_scripts: List[UnpublishedScript] = Relationship(
    #     back_populates="website"
    # )


class Annotation(SQLModel, table=True):
    id: int = Field(primary_key=True)
    script_id: int = Field(foreign_key="script.id")
    location: str
    description: str

    # script: Script = Relationship(back_populates="annotations")
