import InterfaceElement from './InterfaceElement';

enum ASTNodeType {
  Placeholder = 'Placeholder',
  Program = 'Program',
  Section = 'Section',
  Subsection = 'Subsection',
  End = 'End',
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

interface ASTPlaceholderNode {
  type: ASTNodeType.Placeholder;
}

interface ASTProgramNode {
  type: ASTNodeType.Program;
  name: string;
  author: string;
  dateCreated: string;
  start: ASTSectionNode | ASTPlaceholderNode;
}

interface ASTSubsectionNode {
  type: ASTNodeType.Subsection;
  start: ASTStepNode | ASTPlaceholderNode;
}

interface ASTSectionNode {
  type: ASTNodeType.Section;
  url: string;
  start: ASTStepNode | ASTPlaceholderNode;
  name?: string;
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

interface ASTBaseStepNode {
  element: InterfaceElement;
  next: ASTStepNode | ASTPlaceholderNode;
  comment?: string;
}

interface ASTEndNode {
  type: ASTNodeType.End;
}

interface ASTFollowNode {
  type: ASTNodeType.Follow;
  element: InterfaceElement;
  nextSection: ASTNodeType.Section;
  comment?: string;
}

interface ASTClickNode extends ASTBaseStepNode {
  type: ASTNodeType.Click;
}

interface ASTReadNode extends ASTBaseStepNode {
  type: ASTNodeType.Read;
}

interface ASTScrollToNode extends ASTBaseStepNode {
  type: ASTNodeType.ScrollTo;
}

interface ASTDragNode extends ASTBaseStepNode {
  type: ASTNodeType.Drag;
  location: { x: number; y: number };
}

type ASTInputNode = ASTWriteNode | ASTSelectNode | ASTCheckNode | ASTDrawNode;

interface ASTWriteNode extends ASTBaseStepNode {
  type: ASTNodeType.Write;
  text: string;
  description?: string;
}

interface ASTSelectNode extends ASTBaseStepNode {
  type: ASTNodeType.Select;
  option: string;
  description?: string;
}

interface ASTCheckNode extends ASTBaseStepNode {
  type: ASTNodeType.Check;
  isChecked: boolean;
  description?: string;
}

interface ASTDrawNode extends ASTBaseStepNode {
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
  ASTPlaceholderNode,
  ASTProgramNode,
  ASTSectionNode,
  ASTSubsectionNode,
  ASTStepNode,
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
