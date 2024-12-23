import {
  CSTEndStepNode,
  CSTInnerStepNode,
  CSTProgram,
  CSTNode,
  CSTSectionNode,
  CSTStepNode,
  CSTStepNodeType,
  CSTSubsectionNode,
  CSTNodeId,
  CSTInnerStepId,
} from './CST';

const getEditorComponentById = (
  editorProgram: CSTProgram,
  id: CSTNodeId,
): CSTNode | undefined => {
  return editorProgram.sections
    .map((section) => getEditorComponentByIdFromSection(section, id))
    .reduce((prev, curr) => (prev ? prev : curr), undefined);
};

const getEditorComponentByIdFromSection = (
  editorSection: CSTSubsectionNode | CSTSectionNode,
  id: CSTNodeId,
): CSTNode | undefined => {
  if (editorSection.id == id) {
    return editorSection;
  }
  const innerStepsResult = editorSection.innerSteps
    .map((step) => getEditorComponentByIdFromStep(step, id))
    .reduce((prev, curr) => (prev ? prev : curr), undefined);
  const endStepResult = editorSection.endStep
    ? getEditorComponentByIdFromStep(editorSection.endStep, id)
    : undefined;
  return innerStepsResult ? innerStepsResult : endStepResult;
};

const getEditorComponentByIdFromStep = (
  editorStep: CSTStepNode,
  id: CSTNodeId,
): CSTNode | undefined => {
  if (editorStep.id == id) {
    return editorStep;
  }
  if (editorStep.type == CSTStepNodeType.UserDecision) {
    const choice1Result = getEditorComponentByIdFromSection(
      editorStep.choice1,
      id,
    );
    const choice2Result = getEditorComponentByIdFromSection(
      editorStep.choice2,
      id,
    );
    return choice1Result ? choice1Result : choice2Result;
  }
  return undefined;
};

const getNextInnerStepId = (
  sectionNode: CSTSectionNode | CSTSubsectionNode,
): CSTInnerStepId => {
  const innerStepIds = sectionNode.innerSteps.map((step) => step.id.stepId);
  const maxInnerStepId = innerStepIds.length ? Math.max(...innerStepIds) : 0;
  return { parentId: sectionNode.id, stepId: maxInnerStepId + 1 };
};

const getNextSectionId = (editorProgram: CSTProgram): string => {
  return `S${editorProgram.sections.length}`;
};

const getNodeChoices = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTStepNode[] => {
  const innerNodeChoices = getInnerStepNodeChoices(section);
  return section.endStep
    ? innerNodeChoices
    : [...getEndStepNodeChoices(section), ...innerNodeChoices];
};

const getInnerStepNodeChoices = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTInnerStepNode[] => [
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.Click,
  },
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.Read,
  },
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.ScrollTo,
  },
  {
    id: getNextInnerStepId(section),
    type: CSTStepNodeType.Drag,
  },
];

const getEndStepNodeChoices = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTEndStepNode[] => [
  {
    id: { parentId: section.id, stepId: 'E' },
    type: CSTStepNodeType.Follow,
  },
];

export {
  getEditorComponentById,
  getNextInnerStepId as getNextStepId,
  getNextSectionId,
  getNodeChoices,
};
