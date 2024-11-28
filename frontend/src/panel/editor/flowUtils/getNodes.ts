import {
  EditorSection,
  EditorFollowStep,
  EditorInnerStep,
  EditorStepType,
  EditorSubsection,
} from '../../models/programComponent/ProgramComponent';

const getFollowSteps = (
  section: EditorSection | EditorSubsection,
): EditorFollowStep[] => {
  const innerFollowNodes = section.innerSteps
    .map(getFollowStepsFromInnerStep)
    .flat();
  if (!section.endStep) {
    return innerFollowNodes;
  }
  switch (section.endStep.type) {
    case EditorStepType.Follow:
      return innerFollowNodes.concat([section.endStep]);
    case EditorStepType.UserDecision: {
      const choice1FollowNodes = getFollowSteps(section.endStep.choice1);
      const choice2FollowNodes = getFollowSteps(section.endStep.choice2);
      return innerFollowNodes
        .concat(choice1FollowNodes)
        .concat(choice2FollowNodes);
    }
  }
};

const getFollowStepsFromInnerStep = (
  step: EditorInnerStep,
): EditorFollowStep[] => {
  if (step.type != EditorStepType.UserDecision) {
    return [];
  }
  const subsection1InnerFollowNodes = getFollowSteps(step.choice1);
  const subsection2InnerFollowNodes = getFollowSteps(step.choice2);
  return subsection1InnerFollowNodes.concat(subsection2InnerFollowNodes);
};

export { getFollowSteps };
