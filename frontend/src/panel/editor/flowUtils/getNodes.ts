import { EditorSection, EditorFollowStep, EditorInnerStep, EditorStepType } from '../../models/ProgramComponent';

const getFollowSteps = (section: EditorSection): EditorFollowStep[] => {
  const followNodes = section.endStep ? [section.endStep] : [];
  const innerFollowNodes = section.innerSteps.map(getFollowStepsFromInnerStep).flat();
  return followNodes.concat(innerFollowNodes);
};

const getFollowStepsFromInnerStep = (step: EditorInnerStep): EditorFollowStep[] => {
  if (step.type != EditorStepType.UserDecision) {
    return [];
  }
  const subsection1InnerFollowNodes = step.choice1.innerSteps.map(getFollowStepsFromInnerStep).flat();
  const subsection2InnerFollowNodes = step.choice2.innerSteps.map(getFollowStepsFromInnerStep).flat();
  return subsection1InnerFollowNodes.concat(subsection2InnerFollowNodes);
};

export { getFollowSteps };
