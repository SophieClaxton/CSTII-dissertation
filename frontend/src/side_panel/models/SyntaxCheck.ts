import {
  ASTProgram,
  ASTSectionNode,
  ASTStepNode,
  ASTSubsectionNode,
} from './AST/AST';
import { CSTNodeId, CSTSectionId } from './CST/CST';

type SyntaxCheckResult =
  | { success: true; program: ASTProgram }
  | { success: false; errors: SyntaxCheckError[] };

interface SyntaxCheckError {
  location: CSTNodeId;
  reason: string;
}

interface SyntaxCheckErrors {
  type: 'syntax_error';
  errors: SyntaxCheckError[];
}

interface IncompleteSection {
  type: 'incomplete_node';
  missingSectionIds: CSTSectionId[];
  getSection: (missingNextSections: ASTSectionNode[]) => ASTSectionNode;
}

type IncompleteSubsection = IncompleteSubsectionEnd | IncompleteSubsectionInner;

interface IncompleteSubsectionInner {
  type: 'incomplete_node';
  subsectionType: 'inner';
  getSubsection: (nextStep: ASTStepNode) => ASTSubsectionNode;
}

interface IncompleteSubsectionEnd {
  type: 'incomplete_node';
  subsectionType: 'end';
  missingSectionIds: CSTSectionId[];
  getSubsection: (missingNextSections: ASTSectionNode[]) => ASTSubsectionNode;
}

interface IncompleteInnerStep {
  type: 'incomplete_node';
  getInnerStep: (missingNextStep: ASTStepNode) => ASTStepNode;
}

interface IncompleteEndStep {
  type: 'incomplete_node';
  missingSectionIds: CSTSectionId[];
  getEndStep: (missingNextSections: ASTSectionNode[]) => ASTStepNode;
}

export type {
  SyntaxCheckResult,
  SyntaxCheckError,
  SyntaxCheckErrors,
  IncompleteSection,
  IncompleteSubsection,
  IncompleteInnerStep,
  IncompleteEndStep,
};
