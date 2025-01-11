import {
  ASTClickNode,
  ASTEndNode,
  ASTNodeType,
  ASTReadNode,
  ASTSubsectionNode,
  ASTUserDecisionNode,
} from '../../models/AST/AST';
import { Script } from '../../models/Script';

const endNode: ASTEndNode = {
  type: ASTNodeType.End,
};

const readNode: ASTReadNode = {
  type: ASTNodeType.Read,
  element: { outerHTML: '', url: '', tag: 'P' },
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

const testScript: Script = {
  id: 1,
  title: 'Test Program',
  author: { id: 1, name: 'Sophie' },
  created_at: new Date(2024, 12, 1),
  description: 'A script to test the layout of programs',
  website: {
    id: 1,
    url: 'www.test.com',
    description: 'A non-existent test website',
  },
  program: {
    start: {
      type: ASTNodeType.Section,
      url: 'www.gov.co.uk/',
      start: clickNode,
    },
  },
  annotations: [],
};

export default testScript;
