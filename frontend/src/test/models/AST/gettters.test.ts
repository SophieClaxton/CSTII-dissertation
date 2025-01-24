import { ASTNodeType } from '../../../panel/models/AST/AST';
import { getNextPossibleSteps } from '../../../panel/models/AST/getters';
import { ASTInstruction } from '../../../panel/models/AST/Instruction';

describe('getNextPossibleSteps returns', () => {
  it('3 steps for 2 reads and 1 click', () => {
    const visibleSteps: ASTInstruction[] = [
      {
        type: ASTNodeType.Read,
        element: { outerHTML: '', url: '', tag: 'P' },
        stepNumber: 0,
        stage: 'next',
      },
      {
        type: ASTNodeType.Read,
        element: { outerHTML: '', url: '', tag: 'H1' },
        stepNumber: 1,
        stage: 'incomplete',
      },
      {
        type: ASTNodeType.Click,
        element: { outerHTML: '', url: '', tag: 'BUTTON' },
        stepNumber: 2,
        stage: 'incomplete',
      },
    ];

    const possibleSteps = getNextPossibleSteps(visibleSteps);
    expect(possibleSteps.length).toBe(3);
  });

  it('1 step for 1 click and 1 follow', () => {
    const visibleSteps: ASTInstruction[] = [
      {
        type: ASTNodeType.Click,
        element: { outerHTML: '', url: '', tag: 'BUTTON' },
        stepNumber: 0,
        stage: 'next',
      },
      {
        type: ASTNodeType.Follow,
        element: { outerHTML: '', url: '', tag: 'H1' },
        stepNumber: 1,
        stage: 'incomplete',
      },
    ];

    const possibleSteps = getNextPossibleSteps(visibleSteps);
    expect(possibleSteps.length).toBe(1);
  });
});
