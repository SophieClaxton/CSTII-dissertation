import {
  CSTNode,
  CSTSectionNode,
  CSTSubsectionNode,
  CSTStepNodeType,
  CSTUserDecisionEndType,
} from './CST';

const isSection = (node: CSTNode): node is CSTSectionNode => {
  return (
    'id' in node &&
    'sectionId' in node.id &&
    'innerSteps' in node &&
    'url' in node
  );
};

const isSubsection = (node: CSTNode): node is CSTSubsectionNode => {
  return (
    'id' in node &&
    'parentId' in node.id &&
    'subsectionId' in node.id &&
    'innerSteps' in node &&
    'answer' in node
  );
};

const isInnerStep = (node: CSTNode): boolean => {
  if (!('type' in node)) {
    return false;
  }
  const innerStepTypes = [
    CSTStepNodeType.Click,
    CSTStepNodeType.Read,
    CSTStepNodeType.ScrollTo,
    CSTStepNodeType.Drag,
    CSTStepNodeType.Write,
    CSTStepNodeType.Select,
    CSTStepNodeType.Check,
    CSTStepNodeType.Draw,
  ];
  return (
    innerStepTypes.includes(node.type) ||
    (node.type === CSTStepNodeType.UserDecision &&
      node.endsWithFollow === CSTUserDecisionEndType.InnerStep)
  );
};

const isEndStep = (node: CSTNode): boolean => {
  if (!('type' in node)) {
    return false;
  }
  return (
    node.type === CSTStepNodeType.Follow ||
    (node.type === CSTStepNodeType.UserDecision &&
      node.endsWithFollow === CSTUserDecisionEndType.Follow)
  );
};

export { isSection, isSubsection, isInnerStep, isEndStep };
