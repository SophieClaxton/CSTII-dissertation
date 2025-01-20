import { TypeCheckError } from '../CST/typeCheck';
import {
  ASTNode,
  ASTNodeType,
  ASTSectionNode,
  ASTStepNode,
  ASTSubsectionNode,
} from './AST';

const isASTSectionNode = (
  value: ASTNode | TypeCheckError[],
): value is ASTSectionNode => {
  return 'type' in value && value.type === ASTNodeType.Section;
};

const isASTSubsectionNode = (
  value: ASTNode | TypeCheckError[],
): value is ASTSubsectionNode => {
  return 'type' in value && value.type === ASTNodeType.Subsection;
};

const isASTStepNode = (
  value: ASTNode | TypeCheckError[],
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
    ASTNodeType.Draw,
  ];

  return 'type' in value && stepNodeTypes.includes(value.type);
};

export { isASTSectionNode, isASTSubsectionNode, isASTStepNode };
