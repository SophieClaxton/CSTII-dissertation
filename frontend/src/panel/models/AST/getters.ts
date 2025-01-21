import { ASTNodeType, ASTStepNode, ASTStepNodeInfo } from './AST';
import { isSkippable } from './mappers';

/**
 *
 * @param startStep
 * @returns the list of step nodes before a user decision or the end of the program
 */
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

const getNextPossibleSteps = (
  visibleSteps: ASTStepNode[],
): ASTStepNodeInfo[] => {
  const possibleSteps: ASTStepNodeInfo[] = [];
  for (const visibleStep of visibleSteps) {
    switch (visibleStep.type) {
      case ASTNodeType.End: {
        break;
      }
      case ASTNodeType.Follow: {
        const { type, element, comment } = visibleStep;
        possibleSteps.push({ type, element, comment });
        break;
      }
      case ASTNodeType.Click:
      case ASTNodeType.Read:
      case ASTNodeType.ScrollTo:
      case ASTNodeType.Drag:
      case ASTNodeType.Write:
      case ASTNodeType.Select:
      case ASTNodeType.Check:
      case ASTNodeType.Draw: {
        const { next, ...rest } = visibleStep;
        possibleSteps.push(rest);
        break;
      }
      case ASTNodeType.UserDecision: {
        const { type, question } = visibleStep;
        possibleSteps.push({ type, question });
        break;
      }
    }
    if (!isSkippable[visibleStep.type]) {
      break;
    }
  }
  return possibleSteps;
};

export { getVisibleSteps, getNextPossibleSteps };
