from __future__ import annotations
from enum import Enum
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field

from .element import Element, Option


class CSTProgram(BaseModel):
    sections: list[CSTSectionNode]


class CSTSectionId(BaseModel):
    sectionId: int


class CSTSubsectionId(BaseModel):
    parentId: CSTSectionId | CSTEndStepId | CSTInnerStepId
    subsectionId: int


class CSTInnerStepId(BaseModel):
    parentId: CSTSectionId | CSTSubsectionId
    stepId: int


class CSTEndStepId(BaseModel):
    parentId: CSTSectionId | CSTSubsectionId
    stepId: Literal["E"]


class CSTSectionBase(BaseModel):
    innerSteps: list[CSTInnerStepNode]
    endStep: CSTEndStepNode | None = None


class CSTSubsectionNode(CSTSectionBase):
    id: CSTSubsectionId
    answer: Literal["yes"] | Literal["no"]


class CSTSectionNode(CSTSectionBase):
    id: CSTSectionId
    url: str


class CSTStepNodeType(str, Enum):
    Follow = "Go To"
    Click = "Click"
    Read = "Read"
    ScrollTo = "Scroll To"
    Drag = "Drag"
    UserDecision = "User Decision"
    Write = "Write"
    Select = "Select"
    Draw = "Draw"


class CSTStepBase(BaseModel):
    element: Element | None = None


class CSTInnerStepBase(CSTStepBase):
    id: CSTInnerStepId


class CSTFollowNode(CSTStepBase):
    model_config = ConfigDict(use_enum_values=True)

    id: CSTEndStepId
    type: Literal[CSTStepNodeType.Follow]
    nextSectionId: CSTSectionId | None = None


class CSTClickNode(CSTInnerStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.Click]


class CSTReadNode(CSTInnerStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.Read]


class CSTScrollToNode(CSTInnerStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.ScrollTo]


class CSTDragNode(CSTInnerStepBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.Drag]


class CSTUserDecisionEndType(str, Enum):
    Follow = "Follow"
    InnerStep = "InnerStep"


class CSTUserDecisionBase(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.UserDecision]
    question: str | None = None
    choice1: CSTSubsectionNode
    choice2: CSTSubsectionNode


class CSTUserDecisionInnerStepNode(CSTUserDecisionBase):
    model_config = ConfigDict(use_enum_values=True)

    id: CSTInnerStepId
    endsWithFollow: Literal[CSTUserDecisionEndType.InnerStep]


class CSTUserDecisionEndStepNode(CSTUserDecisionBase):
    model_config = ConfigDict(use_enum_values=True)

    id: CSTEndStepId
    endsWithFollow: Literal[CSTUserDecisionEndType.Follow]


class CSTInputBase(CSTInnerStepBase):
    description: str | None = None


class CSTWriteNode(CSTInputBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.Write]
    text: str | None = None
    isExact: bool | None = None


class CSTSelectNode(CSTInputBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.Select]
    selector: CSTSelectOption | CSTCheck | CSTRadio


class CSTSelectOption(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    selectType: Literal["select"]
    option: Option | None = None


class CSTCheck(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    selectType: Literal["check"]
    isChecked: bool


class CSTRadio(BaseModel):
    model_config = ConfigDict(use_enum_values=True)

    selectType: Literal["radio"]


class CSTDrawNode(CSTInputBase):
    model_config = ConfigDict(use_enum_values=True)

    type: Literal[CSTStepNodeType.Draw]


CSTInnerStepNode = Annotated[
    (
        CSTClickNode
        | CSTReadNode
        | CSTScrollToNode
        | CSTDragNode
        | CSTUserDecisionInnerStepNode
        | CSTWriteNode
        | CSTSelectNode
        | CSTDrawNode
    ),
    Field(discriminator="type"),
]

CSTEndStepNode = Annotated[
    (CSTFollowNode | CSTUserDecisionEndStepNode), Field(discriminator="type")
]
