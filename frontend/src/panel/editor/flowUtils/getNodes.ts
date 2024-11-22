import {
  EditorSection,
  EditorFollowStep,
  EditorInnerStep,
  EditorStepType,
  EditorSubsection,
} from '../../models/ProgramComponent';

const getFollowSteps = (section: EditorSection): EditorFollowStep[] => {
  const followNodes = section.endStep ? [section.endStep] : [];
  const innerFollowNodes = section.innerSteps.map(getFollowStepsFromInnerStep).flat();
  return followNodes.concat(innerFollowNodes);
};

const getFollowStepFromSubsection = (subsection: EditorSubsection): EditorFollowStep[] => {
  const followNodes = subsection.endStep ? [subsection.endStep] : [];
  const innerFollowNodes = subsection.innerSteps.map(getFollowStepsFromInnerStep).flat();
  return followNodes.concat(innerFollowNodes);
};

const getFollowStepsFromInnerStep = (step: EditorInnerStep): EditorFollowStep[] => {
  if (step.type != EditorStepType.UserDecision) {
    return [];
  }
  const subsection1InnerFollowNodes = getFollowStepFromSubsection(step.choice1);
  const subsection2InnerFollowNodes = getFollowStepFromSubsection(step.choice2);
  return subsection1InnerFollowNodes.concat(subsection2InnerFollowNodes);
};

export { getFollowSteps };
