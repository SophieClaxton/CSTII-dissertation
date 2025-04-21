import {
  CSTSectionNode,
  CSTFollowNode,
  CSTInnerStepNode,
  CSTStepNodeType,
  CSTSubsectionNode,
} from '../../../models/CST/CST';

const getFollowSteps = (
  section: CSTSectionNode | CSTSubsectionNode,
): CSTFollowNode[] => {
  const innerFollowNodes = section.innerSteps
    .map(getFollowStepsFromInnerStep)
    .flat();
  if (!section.endStep) {
    return innerFollowNodes;
  }
  switch (section.endStep.type) {
    case CSTStepNodeType.Follow:
      return innerFollowNodes.concat([section.endStep]);
    case CSTStepNodeType.UserDecision: {
      const choice1FollowNodes = getFollowSteps(section.endStep.choice1);
      const choice2FollowNodes = getFollowSteps(section.endStep.choice2);
      return innerFollowNodes
        .concat(choice1FollowNodes)
        .concat(choice2FollowNodes);
    }
  }
};

const getFollowStepsFromInnerStep = (
  step: CSTInnerStepNode,
): CSTFollowNode[] => {
  if (step.type != CSTStepNodeType.UserDecision) {
    return [];
  }
  const subsection1InnerFollowNodes = getFollowSteps(step.choice1);
  const subsection2InnerFollowNodes = getFollowSteps(step.choice2);
  return subsection1InnerFollowNodes.concat(subsection2InnerFollowNodes);
};

export { getFollowSteps };
