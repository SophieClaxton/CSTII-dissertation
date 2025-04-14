import {
  CSTProgram,
  CSTNodeId,
  CSTNode,
  CSTSubsectionNode,
  CSTSectionNode,
  CSTStepNode,
  CSTStepNodeType,
  CSTEndStepId,
  CSTFollowNode,
  CSTSectionId,
  CSTSubsectionId,
  CSTSection,
} from '../../../models/CST/CST';
import {
  isInnerStepId,
  isEndStepId,
  isSubsectionId,
  isSection,
  isSubsection,
  isEndStep,
} from '../../../models/CST/testers';
import { mapIdToString } from '../mappers/nodeIds';

const getProgramNodeById = (
  program: CSTProgram,
  id: CSTNodeId,
): CSTNode | undefined => {
  return program.sections
    .map((section) => getProgramNodeByIdFromSection(section, id))
    .reduce((prev, curr) => (prev ? prev : curr), undefined);
};

const getProgramNodeByIdFromSection = (
  section: CSTSubsectionNode | CSTSectionNode,
  id: CSTNodeId,
): CSTNode | undefined => {
  if (mapIdToString(section.id) === mapIdToString(id)) {
    return section;
  }
  const innerStepsResult = section.innerSteps
    .map((step) => getProgramNodeByIdFromStep(step, id))
    .reduce((prev, curr) => (prev ? prev : curr), undefined);
  const endStepResult = section.endStep
    ? getProgramNodeByIdFromStep(section.endStep, id)
    : undefined;
  return innerStepsResult ? innerStepsResult : endStepResult;
};

const getProgramNodeByIdFromStep = (
  step: CSTStepNode,
  id: CSTNodeId,
): CSTNode | undefined => {
  if (mapIdToString(step.id) === mapIdToString(id)) {
    return step;
  }
  if (step.type == CSTStepNodeType.UserDecision) {
    const choice1Result = getProgramNodeByIdFromSection(step.choice1, id);
    const choice2Result = getProgramNodeByIdFromSection(step.choice2, id);
    return choice1Result ? choice1Result : choice2Result;
  }
  return undefined;
};

const getParentSection = (
  nodeId: CSTNodeId,
  program: CSTProgram,
): CSTSectionNode => {
  if (isInnerStepId(nodeId) || isEndStepId(nodeId) || isSubsectionId(nodeId)) {
    return getParentSection(nodeId.parentId, program);
  } else {
    const section = getSection(nodeId, program);
    if (!section || !isSection(section)) {
      throw Error(`No section with id ${mapIdToString(nodeId)}`);
    }
    return section;
  }
};

const getSection = (
  sectionId: CSTSectionId | CSTSubsectionId,
  program: CSTProgram,
): CSTSectionNode | CSTSubsectionNode | undefined => {
  const section = getProgramNodeById(program, sectionId);
  if (!section) {
    console.warn(`Did not find section with id ${mapIdToString(sectionId)}`);
    console.log(program);
    return undefined;
  }
  if (!(isSection(section) || isSubsection(section))) {
    console.warn(
      `Found a program component with id ${mapIdToString(sectionId)} but it is not a section`,
    );
    console.log(section);
    return undefined;
  }
  return section;
};

const getFollowNode = (
  program: CSTProgram,
  followStepId: CSTEndStepId,
): CSTFollowNode | undefined => {
  const step = getProgramNodeById(program, followStepId);
  if (!step) {
    console.warn(`Did not find step with id ${mapIdToString(followStepId)}`);
    console.log(program);
    return undefined;
  }
  if (!isEndStep(step) || step.type != CSTStepNodeType.Follow) {
    console.warn(
      `Found a program component with id ${mapIdToString(followStepId)} but it is not a follow step`,
    );
    console.log(step);
    return undefined;
  }
  return step;
};

const getFollowNodeFromNextSectionId = (
  program: CSTProgram,
  nextSectionId: CSTSectionId,
): CSTFollowNode | undefined => {
  return program.sections
    .map((section) =>
      getFollowNodeInSectionFromNextSectionId(section, nextSectionId),
    )
    .reduce((prev, curr) => (prev ? prev : curr), undefined);
};

const getFollowNodeInSectionFromNextSectionId = <T extends CSTSection>(
  section: T,
  nextSectionId: CSTSectionId,
): CSTFollowNode | undefined => {
  if (
    section.endStep &&
    section.endStep.type === CSTStepNodeType.Follow &&
    section.endStep.nextSectionId &&
    mapIdToString(section.endStep.nextSectionId) ===
      mapIdToString(nextSectionId)
  ) {
    return section.endStep;
  }
  const endStepResult = section.endStep
    ? getFollowNodeInStepFromNextSectionId(section.endStep, nextSectionId)
    : undefined;
  const innerStepsResult = section.innerSteps
    .map((step) => getFollowNodeInStepFromNextSectionId(step, nextSectionId))
    .reduce((prev, curr) => prev ?? curr, undefined);
  return endStepResult ?? innerStepsResult;
};

const getFollowNodeInStepFromNextSectionId = <T extends CSTStepNode>(
  step: T,
  nextSectionId: CSTSectionId,
): CSTFollowNode | undefined => {
  if (step.type === CSTStepNodeType.UserDecision) {
    const choice1Result = getFollowNodeInSectionFromNextSectionId(
      step.choice1,
      nextSectionId,
    );
    const choice2Result = getFollowNodeInSectionFromNextSectionId(
      step.choice2,
      nextSectionId,
    );
    return choice1Result ?? choice2Result;
  }
  return undefined;
};

export {
  getProgramNodeById,
  getParentSection,
  getSection,
  getFollowNode,
  getFollowNodeFromNextSectionId,
};
