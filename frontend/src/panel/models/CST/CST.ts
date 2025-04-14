import InterfaceElement, { Option } from '../interface_element/InterfaceElement';

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
  parentId: CSTEndStepId | CSTInnerStepId;
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

type CSTSection = CSTSubsectionNode | CSTSectionNode;

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
  Follow = 'Go To',
  Click = 'Click',
  Read = 'Read',
  ScrollTo = 'Scroll To',
  Drag = 'Drag',
  UserDecision = 'User Decision',
  Write = 'Write',
  Select = 'Select',
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

type CSTElementNode = Exclude<
  CSTStepNode,
  CSTUserDecisionEndStepNode | CSTUserDecisionInnerStepNode
>;

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
  location?: { x: number; y: number };
}

enum CSTUserDecisionEndType {
  Follow = 'Follow',
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

type CSTInputNode = CSTWriteNode | CSTSelectNode | CSTDrawNode;

interface CSTInputBase extends CSTInnerStepBase {
  description?: string;
}

interface CSTWriteNode extends CSTInputBase {
  type: CSTStepNodeType.Write;
  text?: string;
  isExact?: boolean;
}

interface CSTSelectNode extends CSTInputBase {
  type: CSTStepNodeType.Select;
  selector?: CSTSelectOption | CSTCheck | CSTRadio;
}

interface CSTSelectOption {
  selectType: 'select';
  option?: Option;
}

interface CSTCheck {
  selectType: 'check';
  isChecked: boolean;
}

interface CSTRadio {
  selectType: 'radio';
}

interface CSTDrawNode extends CSTInputBase {
  type: CSTStepNodeType.Draw;
  description?: string;
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
  CSTSection,
  CSTSectionBase,
  CSTSectionNode,
  CSTSubsectionNode,
  CSTStepNode,
  CSTInnerStepNode,
  CSTEndStepNode,
  CSTElementNode,
  CSTStepBase,
  CSTFollowNode,
  CSTClickNode,
  CSTReadNode,
  CSTScrollToNode,
  CSTDragNode,
  CSTUserDecisionNode,
  CSTUserDecisionInnerStepNode,
  CSTUserDecisionEndStepNode,
  CSTInputNode,
  CSTWriteNode,
  CSTSelectNode,
  CSTSelectOption,
  CSTCheck,
  CSTRadio,
  CSTDrawNode,
};
