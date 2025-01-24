import { ASTNodeType, ASTStepNode } from './AST';
import { ASTInstruction } from './Instruction';
import { isSkippable } from './mappers';

/**
 *
 * @param startStep
 * @returns the list of step nodes before a user decision or the end of the program
 */
const getVisibleInstructions = (
  startStep: ASTStepNode,
  baseStepNumber: number,
): ASTInstruction[] => {
  if (startStep.type === ASTNodeType.End) {
    return [];
  }
  const visibleInstructions: ASTInstruction[] = [];
  let nextStep: ASTStepNode = startStep;
  let stepNumber = baseStepNumber;
  while (nextStep.type != ASTNodeType.End) {
    const stage = stepNumber === baseStepNumber ? 'next' : 'incomplete';
    if (nextStep.type === ASTNodeType.Follow) {
      const { nextSection, ...rest } = nextStep;
      visibleInstructions.push({ ...rest, stepNumber, stage });
      nextStep = nextStep.nextSection.start;
    } else if (nextStep.type === ASTNodeType.UserDecision) {
      visibleInstructions.push({ ...nextStep, stepNumber, stage });
      nextStep = { type: ASTNodeType.End };
    } else {
      const { next, ...rest } = nextStep;
      visibleInstructions.push({ ...rest, stepNumber, stage });
      nextStep = nextStep.next;
    }
    stepNumber++;
  }
  return visibleInstructions;
};

const getNextPossibleSteps = (
  visibleInstructions: ASTInstruction[],
): ASTInstruction[] => {
  const possibleSteps: ASTInstruction[] = [];
  for (const instruction of visibleInstructions) {
    if (instruction.stage === 'complete') {
      continue;
    } else {
      if (instruction.type === ASTNodeType.UserDecision) {
        break;
      }
      possibleSteps.push(instruction);
      if (!isSkippable[instruction.type]) {
        break;
      }
    }
  }
  return possibleSteps;
};

export { getVisibleInstructions, getNextPossibleSteps };
