import { ASTNodeType, ASTStepNode } from '../../../panel/models/AST/AST';
import { getNextPossibleSteps } from '../../../panel/models/AST/getters';

describe('getNextPossibleSteps returns', () => {
  it('3 steps for 2 reads and 1 click', () => {
    const visibleSteps: ASTStepNode[] = [
      {
        type: ASTNodeType.Read,
        element: { outerHTML: '', url: '', tag: 'P' },
        next: { type: ASTNodeType.End },
      },
      {
        type: ASTNodeType.Read,
        element: { outerHTML: '', url: '', tag: 'H1' },
        next: { type: ASTNodeType.End },
      },
      {
        type: ASTNodeType.Click,
        element: { outerHTML: '', url: '', tag: 'BUTTON' },
        next: { type: ASTNodeType.End },
      },
    ];

    const possibleSteps = getNextPossibleSteps(visibleSteps, 0);
    expect(possibleSteps.length).toBe(3);
  });

  it('1 step for 1 click and 1 follow', () => {
    const visibleSteps: ASTStepNode[] = [
      {
        type: ASTNodeType.Click,
        element: { outerHTML: '', url: '', tag: 'BUTTON' },
        next: { type: ASTNodeType.End },
      },
      {
        type: ASTNodeType.Follow,
        element: { outerHTML: '', url: '', tag: 'H1' },
        nextSection: {
          type: ASTNodeType.Section,
          url: '',
          start: { type: ASTNodeType.End },
        },
      },
    ];

    const possibleSteps = getNextPossibleSteps(visibleSteps, 0);
    expect(possibleSteps.length).toBe(1);
  });
});
