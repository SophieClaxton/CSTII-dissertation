import {
  CSTNode,
  CSTSectionNode,
  CSTSubsectionNode,
  CSTStepNodeType,
  CSTUserDecisionEndType,
  CSTInnerStepId,
  CSTNodeId,
  CSTEndStepId,
  CSTSubsectionId,
  CSTSectionId,
  CSTEndStepNode,
  CSTInnerStepNode,
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

const isInnerStep = (node: CSTNode): node is CSTInnerStepNode => {
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
    CSTStepNodeType.Draw,
  ];
  return (
    innerStepTypes.includes(node.type) ||
    (node.type === CSTStepNodeType.UserDecision &&
      node.endsWithFollow === CSTUserDecisionEndType.InnerStep)
  );
};

const isEndStep = (node: CSTNode): node is CSTEndStepNode => {
  if (!('type' in node)) {
    return false;
  }
  return (
    node.type === CSTStepNodeType.Follow ||
    (node.type === CSTStepNodeType.UserDecision &&
      node.endsWithFollow === CSTUserDecisionEndType.Follow)
  );
};

const isSectionId = (id: CSTNodeId): id is CSTSectionId => {
  return 'sectionId' in id;
};

const isSubsectionId = (id: CSTNodeId): id is CSTSubsectionId => {
  return 'subsectionId' in id;
};

const isInnerStepId = (id: CSTNodeId): id is CSTInnerStepId => {
  return 'stepId' in id && typeof id.stepId === 'number';
};

const isEndStepId = (id: CSTNodeId): id is CSTEndStepId => {
  return 'stepId' in id && typeof id.stepId === 'string';
};

export {
  isSection,
  isSubsection,
  isInnerStep,
  isEndStep,
  isSectionId,
  isSubsectionId,
  isInnerStepId,
  isEndStepId,
};
