import InterfaceElement from '../InterfaceElement';

interface CSTProgram {
  sections: CSTSectionNode[];
}

type CSTNode =
  | CSTSectionNode
  | CSTSubsectionNode
  | CSTInnerStepNode
  | CSTEndStepNode;

interface CSTSectionId {
  sectionId: number;
}

interface CSTSubsectionId {
  parentId: CSTSectionId | CSTEndStepId | CSTInnerStepId;
  subsectionId: number;
}

interface CSTInnerStepId {
  parentId: CSTSectionId | CSTSubsectionId;
  stepId: number;
}

interface CSTEndStepId {
  parentId: CSTSectionId | CSTSubsectionId;
  stepId: 'E';
}

type CSTNodeId = CSTSectionId | CSTSubsectionId | CSTInnerStepId | CSTEndStepId;
type CSTSectionNodeId = CSTSectionId | CSTSubsectionId;

interface CSTNodeBase {
  id: CSTNodeId;
}

interface CSTSectionBase extends CSTNodeBase {
  innerSteps: CSTInnerStepNode[];
  endStep?: CSTEndStepNode;
}

interface CSTSubsectionNode extends CSTSectionBase {
  id: CSTSubsectionId;
  answer: 'yes' | 'no';
}

interface CSTSectionNode extends CSTSectionBase {
  id: CSTSectionId;
  url: string;
}

enum CSTStepNodeType {
  Follow = 'Follow',
  Click = 'Click',
  Read = 'Read',
  ScrollTo = 'Scroll-To',
  Drag = 'Drag',
  UserDecision = 'User Decision',
  Write = 'Write',
  Select = 'Select',
  Check = 'Check',
  Draw = 'Draw',
}

type CSTStepNode = CSTInnerStepNode | CSTEndStepNode;

interface CSTStepBase extends CSTNodeBase {
  type: CSTStepNodeType;
  element?: InterfaceElement;
}

interface CSTInnerStepBase extends CSTStepBase {
  id: CSTInnerStepId;
}

type CSTInnerStepNode =
  | CSTClickNode
  | CSTReadNode
  | CSTScrollToNode
  | CSTDragNode
  | CSTUserDecisionInnerStepNode
  | CSTInputNode;

type CSTEndStepNode = CSTFollowNode | CSTUserDecisionEndStepNode;

interface CSTFollowNode extends CSTStepBase {
  id: CSTEndStepId;
  type: CSTStepNodeType.Follow;
  nextSectionId?: CSTSectionId;
}

interface CSTClickNode extends CSTInnerStepBase {
  type: CSTStepNodeType.Click;
}

interface CSTReadNode extends CSTInnerStepBase {
  type: CSTStepNodeType.Read;
}

interface CSTScrollToNode extends CSTInnerStepBase {
  type: CSTStepNodeType.ScrollTo;
}

interface CSTDragNode extends CSTInnerStepBase {
  type: CSTStepNodeType.Drag;
}

enum CSTUserDecisionEndType {
  Follow = 'Folow',
  InnerStep = 'InnerStep',
}

type CSTUserDecisionNode =
  | CSTUserDecisionInnerStepNode
  | CSTUserDecisionEndStepNode;

interface CSTUserDecisionBase extends CSTNodeBase {
  type: CSTStepNodeType.UserDecision;
  question?: string;
  choice1: CSTSubsectionNode;
  choice2: CSTSubsectionNode;
  endsWithFollow: CSTUserDecisionEndType;
}

interface CSTUserDecisionInnerStepNode extends CSTUserDecisionBase {
  id: CSTInnerStepId;
  endsWithFollow: CSTUserDecisionEndType.InnerStep;
}

interface CSTUserDecisionEndStepNode extends CSTUserDecisionBase {
  id: CSTEndStepId;
  endsWithFollow: CSTUserDecisionEndType.Follow;
}

type CSTInputNode = CSTWriteNode | CSTSelectNode | CSTCheckNode | CSTDrawNode;

interface CSTInputBase extends CSTInnerStepBase {
  description?: string;
}

interface CSTWriteNode extends CSTInputBase {
  type: CSTStepNodeType.Write;
}

interface CSTSelectNode extends CSTInputBase {
  type: CSTStepNodeType.Select;
}

interface CSTCheckNode extends CSTInputBase {
  type: CSTStepNodeType.Check;
}

interface CSTDrawNode extends CSTInputBase {
  type: CSTStepNodeType.Draw;
}

export { CSTStepNodeType, CSTUserDecisionEndType };
export type {
  CSTProgram,
  CSTNode,
  CSTNodeId,
  CSTSectionNodeId,
  CSTSectionId,
  CSTSubsectionId,
  CSTInnerStepId,
  CSTEndStepId,
  CSTSectionBase,
  CSTSectionNode,
  CSTSubsectionNode,
  CSTStepNode,
  CSTInnerStepNode,
  CSTEndStepNode,
  CSTFollowNode,
  CSTClickNode,
  CSTReadNode,
  CSTScrollToNode,
  CSTDragNode,
  CSTUserDecisionNode,
  CSTUserDecisionInnerStepNode,
  CSTUserDecisionEndStepNode,
  CSTWriteNode,
  CSTSelectNode,
  CSTCheckNode,
  CSTDrawNode,
};