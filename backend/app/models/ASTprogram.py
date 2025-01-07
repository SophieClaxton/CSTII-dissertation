from __future__ import annotations
from enum import Enum
from typing import Literal
from pydantic import BaseModel

from .element import Element


class ASTProgram(BaseModel):
    section: ASTSectionNode


class ASTNodeType(Enum):
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
    type: Literal[ASTNodeType.Subsection]
    start: ASTStepNode


class ASTSectionNode(BaseModel):
    type: Literal[ASTNodeType.Section]
    start: ASTStepNode
    url: str


class ASTStepBase(BaseModel):
    element: Element
    next: ASTStepNode
    comment: str | None


class ASTEndNode(BaseModel):
    type: Literal[ASTNodeType.End]


class ASTFollowNode(BaseModel):
    type: Literal[ASTNodeType.Follow]
    element: Element
    nextSection: ASTSectionNode
    comment: str | None


class ASTClickNode(ASTStepBase):
    type: Literal[ASTNodeType.Click]


class ASTReadNode(ASTStepBase):
    type: Literal[ASTNodeType.Read]


class ASTScrollToNode(ASTStepBase):
    type: Literal[ASTNodeType.ScrollTo]


class ASTDragNode(ASTStepBase):
    type: Literal[ASTNodeType.Drag]
    location: None


class ASTWriteNode(ASTStepBase):
    type: Literal[ASTNodeType.Write]
    text: str
    description: str | None


class ASTSelectNode(ASTStepBase):
    type: Literal[ASTNodeType.Select]
    option: str
    description: str | None


class ASTCheckNode(ASTStepBase):
    type: Literal[ASTNodeType.Check]
    isChecked: bool
    description: str | None


class ASTDrawNode(ASTStepBase):
    type: Literal[ASTNodeType.Draw]
    description: str


ASTInputNode = ASTWriteNode | ASTSelectNode | ASTCheckNode | ASTDrawNode


class ASTUserDecisionNode(BaseModel):
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
