import InterfaceElement from '../InterfaceElement';

interface ASTProgram {
  start: ASTSectionNode;
}

enum ASTNodeType {
  Section = 'Section',
  Subsection = 'Subsection',
  End = 'End',
  Follow = 'Follow',
  Click = 'Click',
  Read = 'Read',
  ScrollTo = 'Scroll To',
  Drag = 'Drag',
  UserDecision = 'User Decision',
  Write = 'Write',
  Select = 'Select',
  Check = 'Check',
  Draw = 'Draw',
}

type ASTNode = ASTSectionNode | ASTSubsectionNode | ASTStepNode;

type ASTSection = ASTSubsectionNode | ASTSectionNode;

interface ASTSubsectionNode {
  type: ASTNodeType.Subsection;
  start: ASTStepNode;
}

interface ASTSectionNode {
  type: ASTNodeType.Section;
  start: ASTStepNode;
  url: string;
}

type ASTStepNode =
  | ASTEndNode
  | ASTFollowNode
  | ASTClickNode
  | ASTReadNode
  | ASTScrollToNode
  | ASTDragNode
  | ASTInputNode
  | ASTUserDecisionNode;

type MappedOmit<T, K extends string> = T extends object ? Omit<T, K> : never;

type ASTStepNodeInfo = MappedOmit<
  ASTStepNode,
  'next' | 'nextSection' | 'choice1' | 'choice2'
>;

interface ASTStepBase {
  element: InterfaceElement;
  next: ASTStepNode;
  comment?: string;
}

interface ASTEndNode {
  type: ASTNodeType.End;
}

interface ASTFollowNode {
  type: ASTNodeType.Follow;
  element: InterfaceElement;
  nextSection: ASTSectionNode;
  comment?: string;
}

interface ASTClickNode extends ASTStepBase {
  type: ASTNodeType.Click;
}

interface ASTReadNode extends ASTStepBase {
  type: ASTNodeType.Read;
}

interface ASTScrollToNode extends ASTStepBase {
  type: ASTNodeType.ScrollTo;
}

interface ASTDragNode extends ASTStepBase {
  type: ASTNodeType.Drag;
  location: { x: number; y: number };
}

type ASTInputNode = ASTWriteNode | ASTSelectNode | ASTCheckNode | ASTDrawNode;

interface ASTWriteNode extends ASTStepBase {
  type: ASTNodeType.Write;
  text: string;
  description?: string;
}

interface ASTSelectNode extends ASTStepBase {
  type: ASTNodeType.Select;
  option: string;
  description?: string;
}

interface ASTCheckNode extends ASTStepBase {
  type: ASTNodeType.Check;
  isChecked: boolean;
  description?: string;
}

interface ASTDrawNode extends ASTStepBase {
  type: ASTNodeType.Draw;
  description: string;
}

interface ASTUserDecisionNode {
  type: ASTNodeType.UserDecision;
  question: string;
  choice1: ASTSubsectionNode;
  choice2: ASTSubsectionNode;
}

export { ASTNodeType };
export type {
  ASTProgram,
  ASTNode,
  ASTSection,
  ASTSectionNode,
  ASTSubsectionNode,
  ASTStepNode,
  ASTStepNodeInfo,
  ASTStepBase,
  ASTEndNode,
  ASTClickNode,
  ASTFollowNode,
  ASTReadNode,
  ASTScrollToNode,
  ASTDragNode,
  ASTInputNode,
  ASTWriteNode,
  ASTSelectNode,
  ASTCheckNode,
  ASTDrawNode,
  ASTUserDecisionNode,
};
