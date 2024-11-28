import {
  EditorEndStep,
  EditorInnerStep,
  EditorProgram,
  EditorProgramComponent,
  EditorProgramSection,
  EditorSection,
  EditorStep,
  EditorStepType,
  EditorSubsection,
} from './ProgramComponent';

const getEditorComponentById = (
  editorProgram: EditorProgram,
  id: string,
): EditorProgramComponent | undefined => {
  return editorProgram.sections
    .map((section) => getEditorComponentByIdFromSection(section, id))
    .reduce((prev, curr) => (prev ? prev : curr), undefined);
};

const getEditorComponentByIdFromSection = (
  editorSection: EditorSubsection | EditorSection,
  id: string,
): EditorProgramComponent | undefined => {
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
  editorStep: EditorStep,
  id: string,
): EditorProgramComponent | undefined => {
  if (editorStep.id == id) {
    return editorStep;
  }
  if (editorStep.type == EditorStepType.UserDecision) {
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

const getNextStepId = (
  editorSection: EditorSection | EditorSubsection,
  isEndStep: boolean = false,
): string => {
  return `${editorSection.id}.${isEndStep ? 'E' : editorSection.innerSteps.length + 1}`;
};

const getNextSectionId = (editorProgram: EditorProgram): string => {
  return `S${editorProgram.sections.length}`;
};

const getNodeChoices = (
  section: EditorSection | EditorSubsection,
): EditorStep[] => {
  const innerNodeChoices = getInnerStepNodeChoices(section);
  return section.endStep
    ? innerNodeChoices
    : [...getEndStepNodeChoices(section), ...innerNodeChoices];
};

const getInnerStepNodeChoices = (
  section: EditorSection | EditorSubsection,
): EditorInnerStep[] => [
  {
    id: getNextStepId(section),
    type: EditorStepType.Click,
  },
  {
    id: getNextStepId(section),
    type: EditorStepType.Read,
  },
  {
    id: getNextStepId(section),
    type: EditorStepType.ScrollTo,
  },
  {
    id: getNextStepId(section),
    type: EditorStepType.Drag,
  },
];

const getEndStepNodeChoices = (
  section: EditorSection | EditorProgramSection,
): EditorEndStep[] => [
  {
    id: `${section.id}.E`,
    type: EditorStepType.Follow,
    parentSectionId: section.id,
  },
];

export {
  getEditorComponentById,
  getNextStepId,
  getNextSectionId,
  getNodeChoices,
};
