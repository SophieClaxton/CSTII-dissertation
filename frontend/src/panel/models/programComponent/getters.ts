import { EditorEndStep, EditorInnerStep, EditorProgram, EditorSection, EditorSubsection } from './ProgramComponent';

const getEditorComponentById = (
  editorProgram: EditorProgram,
  id: string,
): EditorSection | EditorSubsection | EditorInnerStep | EditorEndStep | undefined => {
  return editorProgram.sections
    .map((section) => getEditorComponentByIdFromSection(section, id))
    .reduce((prev, curr) => (prev ? prev : curr));
};

const getEditorComponentByIdFromSection = (
  editorSection: EditorSubsection | EditorSection,
  id: string,
): EditorSection | EditorSubsection | EditorInnerStep | EditorEndStep | undefined => {
  if (editorSection.id == id) {
    return editorSection;
  }
  if (editorSection.endStep && editorSection.endStep.id == id) {
    return editorSection.endStep;
  }
  return editorSection.innerSteps
    .map((step) => (step.id == id ? step : undefined))
    .reduce((prev, curr) => (prev ? prev : curr));
};

const getNextStepId = (editorSection: EditorSection | EditorSubsection, isEndStep: boolean = false): string => {
  return `${editorSection.id}${editorSection.innerSteps.length}${isEndStep ? 'E' : ''}`;
};

const getNextSectionId = (editorProgram: EditorProgram): string => {
  return `S${editorProgram.sections.length}`;
};

export { getEditorComponentById, getNextStepId, getNextSectionId };
