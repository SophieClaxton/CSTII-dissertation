import { EditorFollowStep } from '../ProgramComponent';

const mapEditorFollowStepToId = (followStep: EditorFollowStep) => {
  return `${followStep.parentSectionId}F`;
};

export { mapEditorFollowStepToId };
