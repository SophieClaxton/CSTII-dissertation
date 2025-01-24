import { MappedOmit } from '../utilTypes';
import { ASTEndNode, ASTStepNode } from './AST';

interface InstructionDetail {
  stepNumber: number;
  stage: 'complete' | 'next' | 'incomplete';
}

type ASTInstruction = MappedOmit<
  Exclude<ASTStepNode, ASTEndNode>,
  'next' | 'nextSection'
> &
  InstructionDetail;

export type { ASTInstruction, InstructionDetail };
