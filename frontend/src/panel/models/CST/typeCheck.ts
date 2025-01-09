import {
  ASTNodeType,
  ASTProgram,
  ASTSectionNode,
  ASTStepNode,
  ASTSubsectionNode,
} from '../AST';
import {
  CSTFollowNode,
  CSTInnerStepNode,
  CSTProgram,
  CSTSectionNode,
  CSTStepNodeType,
  CSTSubsectionNode,
  CSTUserDecisionEndStepNode,
} from './CST';
import { mapNodeIdToString } from './mappers';

const typeCheck = (program: CSTProgram): ASTProgram | undefined => {
  // Require sections to be sorted topologically
  const sections = [...program.sections].reverse();
  // take a copy to avoid mutating the original program

  const mappedSections = new Map<string, ASTSectionNode>();

  for (const section of sections) {
    const mappedSection = mapSection(section, mappedSections);
    if (!mappedSection) {
      console.log(
        `Failed type checking for section ${mapNodeIdToString(section.id)}`,
      );
      break;
    }
    mappedSections.set(mapNodeIdToString(section.id), mappedSection);
  }

  const firstSection = mappedSections.get(
    mapNodeIdToString(program.sections[0].id),
  );
  console.log(mappedSections);
  return firstSection ? { start: firstSection } : undefined;
};

const mapSection = (
  section: CSTSectionNode,
  mappedSections: Map<string, ASTSectionNode>,
): ASTSectionNode | undefined => {
  const innerSteps = section.innerSteps.reverse();

  let nextStep: ASTStepNode | undefined;
  switch (section.endStep?.type) {
    case undefined:
      nextStep = { type: ASTNodeType.End };
      break;
    case CSTStepNodeType.Follow:
      if (section.endStep.nextSectionId) {
        const nextSection = mappedSections.get(
          mapNodeIdToString(section.endStep.nextSectionId),
        );
        console.log(section.endStep.nextSectionId);
        console.log(mappedSections);
        nextStep = mapFollowStep(section.endStep, nextSection);
      } else {
        nextStep = undefined;
      }
      break;
    case CSTStepNodeType.UserDecision: {
      const nextSection1 = mapSubsection(
        section.endStep.choice1,
        mappedSections,
      );
      const nextSection2 = mapSubsection(
        section.endStep.choice2,
        mappedSections,
      );
      nextStep = mapUserDecisionStep(
        section.endStep,
        nextSection1,
        nextSection2,
      );
    }
  }

  for (const innerStep of innerSteps) {
    if (!nextStep) {
      break;
    }
    nextStep = mapInnerStep(innerStep, nextStep);
  }

  if (!nextStep) {
    console.log(`Type check failed for ${mapNodeIdToString(section.id)}`);
  }
  return nextStep
    ? { type: ASTNodeType.Section, url: section.url, start: nextStep }
    : undefined;
};

const mapSubsection = (
  section: CSTSubsectionNode,
  mappedSections: Map<string, ASTSectionNode>,
): ASTSubsectionNode | undefined => {
  const innerSteps = section.innerSteps.reverse();

  let nextStep: ASTStepNode | undefined;
  switch (section.endStep?.type) {
    case undefined:
      nextStep = { type: ASTNodeType.End };
      break;
    case CSTStepNodeType.Follow:
      if (section.endStep.nextSectionId) {
        const nextSection = mappedSections.get(
          mapNodeIdToString(section.endStep.nextSectionId),
        );
        console.log(section.endStep.nextSectionId);
        console.log(mappedSections);
        nextStep = mapFollowStep(section.endStep, nextSection);
      } else {
        console.log(
          `Type check failed for ${mapNodeIdToString(section.endStep.id)}, no nextSectionId`,
        );
        nextStep = undefined;
      }
      break;
    case CSTStepNodeType.UserDecision: {
      const nextSection1 = mapSubsection(
        section.endStep.choice1,
        mappedSections,
      );
      const nextSection2 = mapSubsection(
        section.endStep.choice2,
        mappedSections,
      );
      nextStep = mapUserDecisionStep(
        section.endStep,
        nextSection1,
        nextSection2,
      );
    }
  }

  for (const innerStep of innerSteps) {
    if (!nextStep) {
      break;
    }
    nextStep = mapInnerStep(innerStep, nextStep);
  }

  if (!nextStep) {
    console.log(`Type check failed for ${mapNodeIdToString(section.id)}`);
  }
  return nextStep
    ? { type: ASTNodeType.Subsection, start: nextStep }
    : undefined;
};

const mapInnerStep = (
  innerStep: CSTInnerStepNode,
  next: ASTStepNode | undefined,
): ASTStepNode | undefined => {
  switch (innerStep.type) {
    case CSTStepNodeType.Click:
      if (innerStep.element && next) {
        return {
          type: ASTNodeType.Click,
          element: innerStep.element,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.Read:
      if (innerStep.element && next) {
        return {
          type: ASTNodeType.Read,
          element: innerStep.element,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.ScrollTo:
      if (innerStep.element && next) {
        return {
          type: ASTNodeType.ScrollTo,
          element: innerStep.element,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.Drag:
      if (innerStep.element && innerStep.location && next) {
        return {
          type: ASTNodeType.Drag,
          element: innerStep.element,
          location: innerStep.location,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.UserDecision:
      // May need to restrict user decisions to being end steps
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.Write:
      if (innerStep.element && innerStep.text && next) {
        return {
          type: ASTNodeType.Write,
          element: innerStep.element,
          text: innerStep.text,
          description: innerStep.description,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.Select:
      if (innerStep.element && innerStep.option && next) {
        return {
          type: ASTNodeType.Select,
          element: innerStep.element,
          option: innerStep.option,
          description: innerStep.description,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.Check:
      if (innerStep.element && innerStep.isChecked && next) {
        return {
          type: ASTNodeType.Check,
          element: innerStep.element,
          isChecked: innerStep.isChecked,
          description: innerStep.description,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
    case CSTStepNodeType.Draw:
      if (innerStep.element && innerStep.description && next) {
        return {
          type: ASTNodeType.Draw,
          element: innerStep.element,
          description: innerStep.description,
          next: next,
        };
      }
      console.log(`Type check failed for ${mapNodeIdToString(innerStep.id)}`);
      return undefined;
  }
};

const mapFollowStep = (
  endStep: CSTFollowNode,
  nextSection: ASTSectionNode | undefined,
): ASTStepNode | undefined => {
  if (endStep.element && nextSection) {
    return {
      type: ASTNodeType.Follow,
      element: endStep.element,
      nextSection: nextSection,
    };
  }
  console.log(`Type check failed for ${mapNodeIdToString(endStep.id)}`);
  if (!nextSection) {
    console.log('No nextSection');
  }
  return undefined;
};

const mapUserDecisionStep = (
  endStep: CSTUserDecisionEndStepNode,
  nextSection1: ASTSubsectionNode | undefined,
  nextSection2: ASTSubsectionNode | undefined,
): ASTStepNode | undefined => {
  if (endStep.question && nextSection1 && nextSection2) {
    return {
      type: ASTNodeType.UserDecision,
      question: endStep.question,
      choice1: nextSection1,
      choice2: nextSection2,
    };
  }
  console.log(`Type check failed for ${mapNodeIdToString(endStep.id)}`);
  return undefined;
};

export default typeCheck;
