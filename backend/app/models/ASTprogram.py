from __future__ import annotations
from enum import Enum
from typing import Literal
from pydantic import BaseModel, ConfigDict

from .element import Element


class ASTProgram(BaseModel):
    section: ASTSectionNode


class ASTNodeType(str, Enum):
    Placeholder = "Placeholder"
    Section = "Section"
    Subsection = "Subsection"
    End = "End"
    Follow = "Follow"
    Click = "Click"
    Read = "Read"
    ScrollTo = "Scroll-To"
    Drag = "Drag"
    UserDecision = "User Decision"
    Write = "Write"
    Select = "Select"
    Check = "Check"
    Draw = "Draw"


class ASTSubsectionNode(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Subsection]
    start: ASTStepNode


class ASTSectionNode(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Section]
    start: ASTStepNode
    url: str


class ASTStepBase(BaseModel):
    element: Element
    next: ASTStepNode
    comment: str | None = None


class ASTEndNode(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.End]


class ASTFollowNode(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Follow]
    element: Element
    nextSection: ASTSectionNode
    comment: str | None = None


class ASTClickNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Click]


class ASTReadNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Read]


class ASTScrollToNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.ScrollTo]


class ASTDragNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Drag]
    location: None


class ASTWriteNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Write]
    text: str
    description: str | None = None


class ASTSelectNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Select]
    option: str
    description: str | None = None


class ASTCheckNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Check]
    isChecked: bool
    description: str | None = None


class ASTDrawNode(ASTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.Draw]
    description: str


ASTInputNode = ASTWriteNode | ASTSelectNode | ASTCheckNode | ASTDrawNode


class ASTUserDecisionNode(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[ASTNodeType.UserDecision]
    question: str
    choice1: ASTSubsectionNode
    choice2: ASTSubsectionNode


ASTStepNode = (
    ASTEndNode
    | ASTFollowNode
    | ASTClickNode
    | ASTReadNode
    | ASTScrollToNode
    | ASTDragNode
    | ASTInputNode
    | ASTUserDecisionNode
)
