import { ASTStepNode } from '../../../side_panel/models/AST/AST';
import { isASTStepNode } from '../../../side_panel/models/AST/testers';
import { n2, scrollToNode } from '../consts/ASTprograms';

describe('isASTStepNode returns', () => {
  it.each([
    { name: 'Valid ScrollTo node', node: scrollToNode, outcome: true },
    { name: 'Other ScrollTo node', node: n2, outcome: true },
  ])('$outcome for $name', ({ node, outcome }) => {
    const result = isASTStepNode(node as ASTStepNode);
    expect(result).toBe(outcome);
  });
});
