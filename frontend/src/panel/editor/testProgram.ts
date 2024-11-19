import {
  ASTClickNode,
  ASTEndNode,
  ASTNodeType,
  ASTProgramNode,
  ASTReadNode,
  ASTSubsectionNode,
  ASTUserDecisionNode,
} from '../models/Program';

const endNode: ASTEndNode = {
  type: ASTNodeType.End,
};

const readNode: ASTReadNode = {
  type: ASTNodeType.Read,
  element: { outerHTML: '', url: '', tag: 'p' },
  next: endNode,
};

const subsection1: ASTSubsectionNode = {
  type: ASTNodeType.Subsection,
  start: readNode,
};

const subsection2: ASTSubsectionNode = {
  type: ASTNodeType.Subsection,
  start: endNode,
};

const decisionNode: ASTUserDecisionNode = {
  type: ASTNodeType.UserDecision,
  question: 'Are at least 20 years old?',
  choice1: subsection1,
  choice2: subsection2,
};

const clickNode: ASTClickNode = {
  type: ASTNodeType.Click,
  element: { outerHTML: '', url: '', tag: 'A' },
  next: decisionNode,
};

const testProgram: ASTProgramNode = {
  type: ASTNodeType.Program,
  name: 'Test Program',
  author: 'Sophie',
  dateCreated: '19/11/2024',
  start: {
    type: ASTNodeType.Section,
    url: 'www.gov.co.uk/',
    start: clickNode,
  },
};

export default testProgram;
