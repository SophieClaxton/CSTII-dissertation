import { CSTStepNodeType } from '../CST/CST';
import { ASTNodeType } from './AST';

type ASTStepNodes =
  | ASTNodeType.Follow
  | ASTNodeType.Click
  | ASTNodeType.Read
  | ASTNodeType.ScrollTo
  | ASTNodeType.Drag
  | ASTNodeType.UserDecision
  | ASTNodeType.Write
  | ASTNodeType.Select
  | ASTNodeType.Check
  | ASTNodeType.Draw;

const mapCSTtoASTNodeType: Record<CSTStepNodeType, ASTStepNodes> = {
  Follow: ASTNodeType.Follow,
  Click: ASTNodeType.Click,
  Read: ASTNodeType.Read,
  'Scroll To': ASTNodeType.ScrollTo,
  Drag: ASTNodeType.Drag,
  'User Decision': ASTNodeType.UserDecision,
  Write: ASTNodeType.Write,
  Select: ASTNodeType.Select,
  Check: ASTNodeType.Check,
  Draw: ASTNodeType.Draw,
};

export { mapCSTtoASTNodeType };
