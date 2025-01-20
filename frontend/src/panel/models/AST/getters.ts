import { ASTNodeType, ASTStepNode } from './AST';

const getVisibleSteps = (startStep: ASTStepNode): ASTStepNode[] => {
  if (startStep.type === ASTNodeType.End) {
    return [];
  }
  const visibleSteps = [];
  let nextStep: ASTStepNode = startStep;
  while (nextStep.type != ASTNodeType.End) {
    if (nextStep.type === ASTNodeType.Follow) {
      visibleSteps.push(nextStep);
      nextStep = nextStep.nextSection.start;
    } else if (nextStep.type === ASTNodeType.UserDecision) {
      visibleSteps.push(nextStep);
      nextStep = { type: ASTNodeType.End };
    } else {
      visibleSteps.push(nextStep);
      nextStep = nextStep.next;
    }
  }
  return visibleSteps;
};

export { getVisibleSteps };
