import { SyntaxCheckError } from '../SyntaxCheck';
import {
  ASTNode,
  ASTNodeType,
  ASTSectionNode,
  ASTStepNode,
  ASTSubsectionNode,
} from './AST';

const isASTSectionNode = (
  value: ASTNode | SyntaxCheckError[],
): value is ASTSectionNode => {
  return 'type' in value && value.type === ASTNodeType.Section;
};

const isASTSubsectionNode = (
  value: ASTNode | SyntaxCheckError[],
): value is ASTSubsectionNode => {
  return 'type' in value && value.type === ASTNodeType.Subsection;
};

const isASTStepNode = (
  value: ASTNode | SyntaxCheckError[],
): value is ASTStepNode => {
  const stepNodeTypes = [
    ASTNodeType.End,
    ASTNodeType.Follow,
    ASTNodeType.Click,
    ASTNodeType.Read,
    ASTNodeType.ScrollTo,
    ASTNodeType.Drag,
    ASTNodeType.UserDecision,
    ASTNodeType.Write,
    ASTNodeType.Select,
    ASTNodeType.Check,
    ASTNodeType.Radio,
    ASTNodeType.Draw,
  ];

  return 'type' in value && stepNodeTypes.includes(value.type);
};

export { isASTSectionNode, isASTSubsectionNode, isASTStepNode };
